// SQL 转换工具 - 将 SQLite SQL 转换为 PostgreSQL SQL

function convertSQLiteToPostgreSQL(sql) {
    let converted = sql;

    // 1. INTEGER PRIMARY KEY AUTOINCREMENT -> SERIAL PRIMARY KEY
    converted = converted.replace(/INTEGER\s+PRIMARY\s+KEY\s+AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY');
    
    // 2. AUTOINCREMENT -> SERIAL (如果前面没有 PRIMARY KEY)
    converted = converted.replace(/INTEGER\s+AUTOINCREMENT/gi, 'SERIAL');
    
    // 3. DATETIME -> TIMESTAMP
    converted = converted.replace(/DATETIME/gi, 'TIMESTAMP');
    
    // 4. BOOLEAN -> BOOLEAN (PostgreSQL 支持，但默认值需要调整)
    converted = converted.replace(/BOOLEAN\s+DEFAULT\s+(\d)/gi, (match, value) => {
        return `BOOLEAN DEFAULT ${value === '1' ? 'true' : 'false'}`;
    });
    
    // 5. TEXT -> TEXT (相同)
    // 6. VARCHAR -> VARCHAR (相同)
    // 7. INTEGER -> INTEGER (相同)
    // 8. DECIMAL -> DECIMAL (相同)
    
    // 9. CURRENT_TIMESTAMP -> CURRENT_TIMESTAMP (相同)
    
    // 10. IF NOT EXISTS -> IF NOT EXISTS (相同)
    
    // 11. UNIQUE 约束语法相同
    
    // 12. FOREIGN KEY 语法相同
    
    // 13. ON DELETE CASCADE 语法相同
    
    return converted;
}

// 转换表结构
function convertTableSchema(sqliteSchema) {
    return convertSQLiteToPostgreSQL(sqliteSchema);
}

// 转换查询语句（大部分相同，但有一些差异）
function convertQuery(sql) {
    let converted = sql;

    // SQLite 的 PRAGMA 需要特殊处理
    if (sql.includes('PRAGMA table_info')) {
        // PostgreSQL 使用 information_schema
        const tableMatch = sql.match(/PRAGMA\s+table_info\((\w+)\)/i);
        if (tableMatch) {
            const tableName = tableMatch[1];
            converted = `
                SELECT 
                    column_name as name,
                    data_type as type,
                    is_nullable as notnull,
                    column_default as dflt_value,
                    CASE WHEN pk.column_name IS NOT NULL THEN 1 ELSE 0 END as pk
                FROM information_schema.columns
                LEFT JOIN (
                    SELECT column_name 
                    FROM information_schema.table_constraints tc
                    JOIN information_schema.key_column_usage kcu 
                        ON tc.constraint_name = kcu.constraint_name
                    WHERE tc.table_name = '${tableName}' 
                        AND tc.constraint_type = 'PRIMARY KEY'
                ) pk ON information_schema.columns.column_name = pk.column_name
                WHERE table_name = '${tableName}'
                ORDER BY ordinal_position
            `;
        }
    }

    // SQLite 的 last_insert_rowid() -> PostgreSQL 的 RETURNING id
    // 这个需要在 INSERT 语句中处理

    return converted;
}

module.exports = {
    convertSQLiteToPostgreSQL,
    convertTableSchema,
    convertQuery
};

