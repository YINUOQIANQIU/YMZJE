// 数据库适配器 - 支持 SQLite 和 PostgreSQL
// 自动根据环境变量选择数据库类型

class DatabaseAdapter {
    constructor() {
        this.db = null;
        this.dbType = null;
        this.isVercel = process.env.VERCEL || process.env.VERCEL_ENV;
        
        // 检测数据库类型
        if (process.env.POSTGRES_URL || process.env.DATABASE_URL) {
            this.dbType = 'postgres';
            this.initPostgreSQL();
        } else if (!this.isVercel) {
            this.dbType = 'sqlite';
            this.initSQLite();
        } else {
            console.error('❌ Vercel 环境必须配置 PostgreSQL 数据库');
            throw new Error('请设置 POSTGRES_URL 或 DATABASE_URL 环境变量');
        }
    }

    // 初始化 Supabase REST API（最简单的方法）
    initSupabase() {
        const { getSupabaseDB } = require('./supabase-db.js');
        
        try {
            this.db = getSupabaseDB();
            if (!this.db) {
                throw new Error('Supabase 初始化失败');
            }
            console.log('✅ 使用 Supabase REST API（无需数据库连接字符串）');
            this.dbType = 'supabase';
        } catch (error) {
            console.error('❌ Supabase 初始化失败:', error.message);
            throw error;
        }
    }

    initPostgreSQL() {
        const { Pool } = require('pg');
        
        // 支持多种 PostgreSQL 连接字符串格式
        const connectionString = process.env.POSTGRES_URL || 
                                 process.env.DATABASE_URL ||
                                 process.env.POSTGRES_PRISMA_URL ||
                                 process.env.POSTGRES_URL_NON_POOLING ||
                                 process.env.SUPABASE_DB_URL ||
                                 this.buildSupabaseConnectionString();

        if (!connectionString) {
            throw new Error('PostgreSQL 连接字符串未配置');
        }

        this.pool = new Pool({
            connectionString: connectionString,
            ssl: (process.env.VERCEL || process.env.SUPABASE_URL) ? { rejectUnauthorized: false } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        // 测试连接
        this.pool.query('SELECT NOW()', (err, res) => {
            if (err) {
                console.error('PostgreSQL 连接错误:', err);
            } else {
                console.log('✅ 成功连接到 PostgreSQL 数据库');
                console.log('数据库类型: PostgreSQL');
                if (process.env.SUPABASE_URL) {
                    console.log('数据库服务: Supabase');
                } else if (process.env.VERCEL) {
                    console.log('数据库服务: Vercel Postgres');
                }
            }
        });

        this.db = this.pool;
        this.dbType = 'postgres';
    }

    // 从 Supabase URL 构建连接字符串
    buildSupabaseConnectionString() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseDbPassword = process.env.SUPABASE_DB_PASSWORD;
        const supabaseDbHost = process.env.SUPABASE_DB_HOST;

        if (supabaseUrl && supabaseDbPassword && supabaseDbHost) {
            // 从 Supabase URL 提取项目引用
            const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
            return `postgresql://postgres.${projectRef}:${supabaseDbPassword}@${supabaseDbHost}:5432/postgres`;
        }

        return null;
    }

    initSQLite() {
        const sqlite3 = require('sqlite3').verbose();
        const path = require('path');
        const fs = require('fs');

        const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../moyu_zhixue.db');
        const dbDir = path.dirname(dbPath);
        
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('SQLite 连接错误:', err);
            } else {
                console.log('✅ 成功连接到 SQLite 数据库');
                console.log('数据库路径:', dbPath);
            }
        });

        this.dbType = 'sqlite';
    }

    // JSON 文件存储（后备方案）
    initJSONStorage() {
        const fs = require('fs');
        const path = require('path');
        
        this.storagePath = path.join(__dirname, '../data/storage.json');
        const storageDir = path.dirname(this.storagePath);
        
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }
        
        // 初始化存储文件
        if (!fs.existsSync(this.storagePath)) {
            fs.writeFileSync(this.storagePath, JSON.stringify({}, null, 2));
        }
        
        console.log('✅ 使用 JSON 文件存储（后备方案）');
        console.log('⚠️ 注意：JSON 存储功能有限，建议配置 Supabase 数据库');
        this.dbType = 'json';
    }

    // 统一查询接口
    query(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'postgres') {
                // PostgreSQL 查询
                this.pool.query(sql, params, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows);
                    }
                });
            } else {
                // SQLite 查询
                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            }
        });
    }

    // 获取单条记录
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'supabase') {
                // Supabase REST API 查询
                this.db.get(sql, params)
                    .then(resolve)
                    .catch(reject);
            } else if (this.dbType === 'postgres') {
                this.pool.query(sql, params, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result.rows[0] || null);
                    }
                });
            } else {
                this.db.get(sql, params, (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row || null);
                    }
                });
            }
        });
    }

    // 执行 SQL（INSERT, UPDATE, DELETE）
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'supabase') {
                // Supabase REST API 执行
                this.db.run(sql, params)
                    .then(resolve)
                    .catch(reject);
            } else if (this.dbType === 'postgres') {
                // PostgreSQL: 如果是 INSERT，添加 RETURNING id
                let querySQL = sql;
                if (sql.trim().toUpperCase().startsWith('INSERT') && !sql.includes('RETURNING')) {
                    // 尝试添加 RETURNING id
                    querySQL = sql.replace(/;?\s*$/, '') + ' RETURNING id';
                }
                
                this.pool.query(querySQL, params, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            lastID: result.rows[0]?.id || result.insertId,
                            changes: result.rowCount || 0
                        });
                    }
                });
            } else {
                this.db.run(sql, params, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            lastID: this.lastID,
                            changes: this.changes
                        });
                    }
                });
            }
        });
    }

    // 执行多个 SQL（事务）
    exec(sql) {
        return new Promise((resolve, reject) => {
            if (this.dbType === 'postgres') {
                // PostgreSQL 使用事务
                this.pool.query('BEGIN', (err) => {
                    if (err) return reject(err);
                    
                    this.pool.query(sql, (err, result) => {
                        if (err) {
                            this.pool.query('ROLLBACK', () => reject(err));
                        } else {
                            this.pool.query('COMMIT', (err) => {
                                if (err) reject(err);
                                else resolve(result);
                            });
                        }
                    });
                });
            } else {
                this.db.exec(sql, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            }
        });
    }

    // 关闭连接
    close() {
        if (this.dbType === 'postgres') {
            return this.pool.end();
        } else {
            return new Promise((resolve) => {
                this.db.close(resolve);
            });
        }
    }
}

module.exports = DatabaseAdapter;

