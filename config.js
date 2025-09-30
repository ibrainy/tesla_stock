// Polygon.io API配置文件
// 使用Polygon.io HTTP REST API获取真实股票数据

const POLYGON_CONFIG = {
    // Polygon.io API基础URL
    baseUrl: 'https://api.polygon.io',
    
    // 您的Polygon.io API Key
    apiKey: 'MtvNbB_tRfUTMdnqG9YHld0cKC6wK8gk',
    
    // 调试模式 - 显示详细的API调用信息
    debug: true,
    
    // 请求超时时间（毫秒）
    timeout: 10000,
    
    // 更新间隔（毫秒）
    updateInterval: 5000, // 5秒更新一次
    
    // 支持的股票列表
    stocks: [
        { symbol: 'TSLA', name: '特斯拉', code: 'TSLA' },
        { symbol: 'AAPL', name: '苹果', code: 'AAPL' },
        { symbol: 'MSFT', name: '微软', code: 'MSFT' },
        { symbol: 'NVDA', name: '英伟达', code: 'NVDA' },
        { symbol: 'GOOGL', name: '谷歌', code: 'GOOGL' },
        { symbol: 'AMZN', name: '亚马逊', code: 'AMZN' },
        { symbol: 'META', name: 'META', code: 'META' },
        { symbol: 'QQQ', name: 'QQQ', code: 'QQQ' },
        { symbol: 'BRK.B', name: '伯克希尔', code: 'BRK.B' }
    ]
};
