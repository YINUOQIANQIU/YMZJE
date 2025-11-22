// Supabase 自动设置脚本
// 如果配置了 Supabase，自动创建数据库表

const { createClient } = require('@supabase/supabase-js');

let supabase = null;

// 初始化 Supabase 客户端
function initSupabase() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.log('ℹ️ Supabase 未配置，跳过初始化');
        return null;
    }

    try {
        supabase = createClient(supabaseUrl, supabaseKey);
        console.log('✅ Supabase 客户端初始化成功');
        return supabase;
    } catch (error) {
        console.error('❌ Supabase 初始化失败:', error.message);
        return null;
    }
}

// 自动创建表（如果不存在）
async function setupSupabaseTables() {
    if (!supabase) {
        supabase = initSupabase();
        if (!supabase) return;
    }

    console.log('🚀 开始设置 Supabase 数据库表...');

    // 表结构 SQL（PostgreSQL 格式）
    const tables = [
        {
            name: 'users',
            sql: `
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    name VARCHAR(50) NOT NULL,
                    phone VARCHAR(20),
                    avatar VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_login TIMESTAMP,
                    is_active BOOLEAN DEFAULT true
                )
            `
        },
        {
            name: 'community_posts',
            sql: `
                CREATE TABLE IF NOT EXISTS community_posts (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    title VARCHAR(255) NOT NULL,
                    content TEXT NOT NULL,
                    category VARCHAR(50) NOT NULL,
                    tags TEXT,
                    view_count INTEGER DEFAULT 0,
                    like_count INTEGER DEFAULT 0,
                    comment_count INTEGER DEFAULT 0,
                    is_pinned BOOLEAN DEFAULT false,
                    is_active BOOLEAN DEFAULT true,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )
            `
        }
        // 可以添加更多表...
    ];

    // 注意：Supabase 需要通过 SQL Editor 或 REST API 创建表
    // 这里提供 SQL 供用户复制，或使用 Supabase Management API
    console.log('📝 请在 Supabase Dashboard 的 SQL Editor 中执行以下 SQL：');
    tables.forEach(table => {
        console.log(`\n-- 创建 ${table.name} 表`);
        console.log(table.sql);
    });

    return true;
}

module.exports = {
    initSupabase,
    setupSupabaseTables,
    getSupabase: () => supabase
};

