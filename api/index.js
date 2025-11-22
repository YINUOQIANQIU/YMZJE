// Vercel Serverless Function 入口
// 将Express应用适配为Vercel Serverless Function

// 设置Vercel环境变量
process.env.VERCEL = '1';
process.env.VERCEL_ENV = process.env.VERCEL_ENV || 'production';

// 优化：延迟加载以减少初始函数大小
let app = null;

// 导出处理函数
module.exports = async (req, res) => {
    // 延迟加载Express应用
    if (!app) {
        try {
            app = require('../云梦智间服务器.js');
        } catch (error) {
            console.error('加载Express应用失败:', error);
            return res.status(500).json({
                success: false,
                message: '服务器初始化失败',
                error: error.message
            });
        }
    }
    
    // 处理请求
    return app(req, res);
};

