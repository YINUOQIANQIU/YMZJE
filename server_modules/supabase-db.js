// Supabase 数据库适配器 - 使用 Supabase JavaScript 客户端
// 只需要 SUPABASE_URL 和 SUPABASE_ANON_KEY，无需数据库连接字符串

const { createClient } = require('@supabase/supabase-js');

let supabase = null;
let dbWrapper = null;

// 初始化 Supabase 客户端
function initSupabase() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.log('ℹ️ Supabase 未配置，将使用其他数据库');
        return null;
    }

    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase 客户端初始化成功');
        console.log('数据库服务: Supabase (REST API)');
        return supabase;
    } catch (error) {
        console.error('❌ Supabase 初始化失败:', error.message);
        return null;
    }
}

// 创建兼容 SQLite API 的包装器
class SupabaseWrapper {
    constructor(supabaseClient) {
        this.supabase = supabaseClient;
    }

    // 兼容 SQLite 的 all 方法
    all(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        
        this.query(sql, params || [])
            .then(rows => {
                if (callback) callback(null, rows);
            })
            .catch(err => {
                if (callback) callback(err);
            });
    }

    // 兼容 SQLite 的 get 方法
    get(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        
        this.query(sql, params || [])
            .then(rows => {
                if (callback) callback(null, rows[0] || null);
            })
            .catch(err => {
                if (callback) callback(err);
            });
    }

    // 兼容 SQLite 的 run 方法
    run(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        
        this.execute(sql, params || [])
            .then(result => {
                if (callback) {
                    const context = {
                        lastID: result.lastID,
                        changes: result.changes
                    };
                    callback.call(context, null);
                }
            })
            .catch(err => {
                if (callback) callback(err);
            });
    }

    // 执行查询（SELECT）
    async query(sql, params) {
        // 解析 SQL 语句
        const sqlUpper = sql.trim().toUpperCase();
        
        if (sqlUpper.startsWith('SELECT')) {
            return this.selectQuery(sql, params);
        } else if (sqlUpper.startsWith('INSERT')) {
            return this.insertQuery(sql, params);
        } else if (sqlUpper.startsWith('UPDATE')) {
            return this.updateQuery(sql, params);
        } else if (sqlUpper.startsWith('DELETE')) {
            return this.deleteQuery(sql, params);
        } else {
            // 其他 SQL，尝试直接执行
            return this.executeQuery(sql, params);
        }
    }

    // SELECT 查询
    async selectQuery(sql, params) {
        // 简单的 SQL 解析（实际项目中可能需要更复杂的解析器）
        const tableMatch = sql.match(/FROM\s+(\w+)/i);
        if (!tableMatch) {
            throw new Error('无法解析表名');
        }
        
        const tableName = tableMatch[1];
        let query = this.supabase.from(tableName).select('*');
        
        // 简单的 WHERE 条件处理
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
        if (whereMatch && params.length > 0) {
            const condition = whereMatch[1];
            // 处理简单的等值条件
            const eqMatch = condition.match(/(\w+)\s*=\s*\?/i);
            if (eqMatch) {
                const column = eqMatch[1];
                const value = params[0];
                query = query.eq(column, value);
            }
        }
        
        // LIMIT 处理
        const limitMatch = sql.match(/LIMIT\s+(\d+)/i);
        if (limitMatch) {
            query = query.limit(parseInt(limitMatch[1]));
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    }

    // INSERT 查询
    async insertQuery(sql, params) {
        const tableMatch = sql.match(/INTO\s+(\w+)/i);
        if (!tableMatch) {
            throw new Error('无法解析表名');
        }
        
        const tableName = tableMatch[1];
        
        // 从 SQL 和 params 构建数据对象（简化实现）
        // 实际使用中，需要更复杂的解析
        const columnsMatch = sql.match(/\(([^)]+)\)/);
        if (columnsMatch && params.length > 0) {
            const columns = columnsMatch[1].split(',').map(c => c.trim());
            const data = {};
            columns.forEach((col, index) => {
                if (params[index] !== undefined) {
                    data[col] = params[index];
                }
            });
            
            const { data: result, error } = await this.supabase
                .from(tableName)
                .insert(data)
                .select();
            
            if (error) throw error;
            return {
                lastID: result[0]?.id,
                changes: 1
            };
        }
        
        throw new Error('无法解析 INSERT 语句');
    }

    // UPDATE 查询
    async updateQuery(sql, params) {
        const tableMatch = sql.match(/UPDATE\s+(\w+)/i);
        if (!tableMatch) {
            throw new Error('无法解析表名');
        }
        
        const tableName = tableMatch[1];
        
        // 简化的 UPDATE 实现
        const setMatch = sql.match(/SET\s+(.+?)(?:\s+WHERE|$)/i);
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
        
        if (setMatch) {
            const updates = {};
            // 解析 SET 子句（简化）
            const setClause = setMatch[1];
            const assignments = setClause.split(',').map(a => a.trim());
            assignments.forEach((assignment, index) => {
                const [column, value] = assignment.split('=').map(s => s.trim());
                if (value === '?') {
                    updates[column] = params[index];
                } else {
                    updates[column] = value.replace(/['"]/g, '');
                }
            });
            
            let query = this.supabase.from(tableName).update(updates);
            
            if (whereMatch && params.length > assignments.length) {
                const condition = whereMatch[1];
                const eqMatch = condition.match(/(\w+)\s*=\s*\?/i);
                if (eqMatch) {
                    const column = eqMatch[1];
                    const value = params[assignments.length];
                    query = query.eq(column, value);
                }
            }
            
            const { data, error } = await query.select();
            if (error) throw error;
            return {
                lastID: null,
                changes: data?.length || 0
            };
        }
        
        throw new Error('无法解析 UPDATE 语句');
    }

    // DELETE 查询
    async deleteQuery(sql, params) {
        const tableMatch = sql.match(/FROM\s+(\w+)/i);
        if (!tableMatch) {
            throw new Error('无法解析表名');
        }
        
        const tableName = tableMatch[1];
        let query = this.supabase.from(tableName).delete();
        
        const whereMatch = sql.match(/WHERE\s+(.+?)(?:\s+ORDER|\s+LIMIT|$)/i);
        if (whereMatch && params.length > 0) {
            const condition = whereMatch[1];
            const eqMatch = condition.match(/(\w+)\s*=\s*\?/i);
            if (eqMatch) {
                const column = eqMatch[1];
                const value = params[0];
                query = query.eq(column, value);
            }
        }
        
        const { data, error } = await query.select();
        if (error) throw error;
        return {
            lastID: null,
            changes: data?.length || 0
        };
    }

    // 执行其他 SQL（如 CREATE TABLE）
    async executeQuery(sql, params) {
        // 对于 DDL 语句，Supabase 需要通过 SQL Editor 或 Management API
        // 这里返回成功，实际表创建需要在 Supabase Dashboard 中完成
        console.log('⚠️ DDL 语句需要通过 Supabase Dashboard 执行:', sql.substring(0, 100));
        return [];
    }

    // 执行 SQL（INSERT, UPDATE, DELETE）
    async execute(sql, params) {
        const sqlUpper = sql.trim().toUpperCase();
        
        if (sqlUpper.startsWith('INSERT')) {
            return this.insertQuery(sql, params);
        } else if (sqlUpper.startsWith('UPDATE')) {
            return this.updateQuery(sql, params);
        } else if (sqlUpper.startsWith('DELETE')) {
            return this.deleteQuery(sql, params);
        } else {
            return this.executeQuery(sql, params);
        }
    }

    // 兼容 SQLite 的 exec 方法
    exec(sql, callback) {
        this.executeQuery(sql, [])
            .then(() => {
                if (callback) callback(null);
            })
            .catch(err => {
                if (callback) callback(err);
            });
    }

    // 兼容 SQLite 的 serialize 方法
    serialize(callback) {
        if (callback) callback();
    }

    // 关闭连接（Supabase 不需要）
    close(callback) {
        if (callback) callback(null);
    }
}

// 初始化
function getSupabaseDB() {
    if (!supabase) {
        supabase = initSupabase();
    }
    
    if (supabase && !dbWrapper) {
        dbWrapper = new SupabaseWrapper(supabase);
    }
    
    return dbWrapper;
}

module.exports = {
    initSupabase,
    getSupabaseDB,
    getSupabase: () => supabase
};

