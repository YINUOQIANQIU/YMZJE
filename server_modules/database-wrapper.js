// 数据库包装器 - 提供 SQLite 兼容的 API
// 支持 SQLite、PostgreSQL 和 Supabase REST API

const DatabaseAdapter = require('./database-adapter.js');

class DatabaseWrapper {
    constructor() {
        this.adapter = new DatabaseAdapter();
        this.dbType = this.adapter.dbType;
        
        // 如果是 Supabase，直接使用包装器
        if (this.dbType === 'supabase') {
            this.db = this.adapter.db;
        } else {
            this.db = this.adapter.db;
        }
    }

    // 兼容 SQLite 的 all 方法
    all(sql, params, callback) {
        if (typeof params === 'function') {
            callback = params;
            params = [];
        }
        
        // 如果是 Supabase，直接使用包装器的方法
        if (this.dbType === 'supabase' && this.db && typeof this.db.all === 'function') {
            return this.db.all(sql, params, callback);
        }
        
        this.adapter.query(sql, params || [])
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
        
        // 如果是 Supabase，直接使用包装器的方法
        if (this.dbType === 'supabase' && this.db && typeof this.db.get === 'function') {
            return this.db.get(sql, params, callback);
        }
        
        this.adapter.get(sql, params || [])
            .then(row => {
                if (callback) callback(null, row);
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
        
        // 如果是 Supabase，直接使用包装器的方法
        if (this.dbType === 'supabase' && this.db && typeof this.db.run === 'function') {
            return this.db.run(sql, params, callback);
        }
        
        this.adapter.run(sql, params || [])
            .then(result => {
                if (callback) {
                    // 创建类似 SQLite 的 this 上下文
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

    // 兼容 SQLite 的 exec 方法
    exec(sql, callback) {
        this.adapter.exec(sql)
            .then(() => {
                if (callback) callback(null);
            })
            .catch(err => {
                if (callback) callback(err);
            });
    }

    // 兼容 SQLite 的 serialize 方法
    serialize(callback) {
        // PostgreSQL 不需要 serialize，直接执行
        if (callback) callback();
    }

    // 关闭连接
    close(callback) {
        this.adapter.close()
            .then(() => {
                if (callback) callback(null);
            })
            .catch(err => {
                if (callback) callback(err);
            });
    }
}

module.exports = DatabaseWrapper;

