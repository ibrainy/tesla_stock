// 使用配置文件中的Polygon.io HTTP REST API配置
// 配置在config.js文件中定义

// 全局变量
let stockData = {};
let lastSuccessfulData = {}; // 存储上一次成功获取的数据
let updateInterval;
let isConnected = false;

// DOM元素
const elements = {
    lastUpdate: document.getElementById('lastUpdate'),
    statusIndicator: document.getElementById('statusIndicator'),
    statusDot: document.querySelector('.status-dot'),
    statusText: document.querySelector('.status-text')
};

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 初始化应用
function initializeApp() {
    console.log('初始化股票价格应用...');
    updateStatus('连接中...', 'connecting');
    
    // 立即获取一次数据
    fetchStockData();
    
    // 设置定时刷新
    updateInterval = setInterval(fetchStockData, POLYGON_CONFIG.updateInterval);
    
    // 页面可见性变化时重新获取数据
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            fetchStockData();
        }
    });
}

// 获取股票数据
async function fetchStockData() {
    try {
        console.log('正在获取股票数据...');
        
        // 获取所有股票数据
        const stockPromises = POLYGON_CONFIG.stocks.map(async (stock) => {
            try {
                const data = await fetchPolygonStock(stock.symbol);
                return { key: getStockKey(stock.code), data };
            } catch (error) {
                console.error(`获取${stock.name}数据失败:`, error);
                return { key: getStockKey(stock.code), data: null, error: error.message };
            }
        });
        
        const results = await Promise.all(stockPromises);
        
        // 处理获取到的数据
        let successCount = 0;
        let errorCount = 0;
        
        results.forEach(({ key, data, error }) => {
            if (data) {
                stockData[key] = data;
                lastSuccessfulData[key] = data; // 保存成功的数据
                updateStockDisplay(key, data);
                successCount++;
            } else {
                // 如果有上一次成功的数据，使用它；否则显示错误
                if (lastSuccessfulData[key]) {
                    stockData[key] = lastSuccessfulData[key];
                    updateStockDisplay(key, lastSuccessfulData[key], true); // 标记为缓存数据
                    successCount++;
                } else {
                    showStockError(key, error);
                    errorCount++;
                }
            }
        });
        
        // 根据成功/失败数量更新状态
        if (successCount > 0 && errorCount === 0) {
            updateStatus('已连接', 'connected');
            isConnected = true;
        } else if (successCount > 0 && errorCount > 0) {
            updateStatus('部分连接', 'connecting');
            isConnected = false;
        } else {
            updateStatus('连接失败', 'error');
            isConnected = false;
        }
        
        updateLastUpdateTime();
        
    } catch (error) {
        console.error('获取股票数据失败:', error);
        updateStatus('连接失败', 'error');
        isConnected = false;
    }
}

// 从Polygon.io HTTP API获取股票数据
async function fetchPolygonStock(symbol) {
    const url = `${POLYGON_CONFIG.baseUrl}/v2/aggs/ticker/${symbol}/prev?adjusted=true&apikey=${POLYGON_CONFIG.apiKey}`;
    
    if (POLYGON_CONFIG.debug) {
        console.log(`正在获取${symbol}的Polygon.io数据:`, url);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), POLYGON_CONFIG.timeout);
    
    try {
        const response = await fetch(url, {
            signal: controller.signal,
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (POLYGON_CONFIG.debug) {
            console.log(`${symbol} Polygon.io响应:`, result);
        }
        
        // 检查响应状态
        if (result.status !== 'OK') {
            throw new Error(result.message || 'API错误');
        }
        
        const data = result.results;
        
        if (!data || data.length === 0) {
            throw new Error('没有可用的股票数据');
        }
        
        const stockInfo = data[0];
        
        // 解析股票数据
        const stockData = {
            symbol: symbol,
            price: parseFloat(stockInfo.c) || 0, // 收盘价
            change: parseFloat(stockInfo.c - stockInfo.o) || 0, // 涨跌额
            changePercent: parseFloat(((stockInfo.c - stockInfo.o) / stockInfo.o) * 100) || 0, // 涨跌幅
            timestamp: new Date().toISOString(),
            source: 'Polygon.io API'
        };
        
        return stockData;
        
    } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
            throw new Error('请求超时');
        }
        
        if (POLYGON_CONFIG.debug) {
            console.error(`${symbol} Polygon.io API错误:`, error);
        }
        
        throw error;
    }
}

// 获取股票键名
function getStockKey(code) {
    const codeMap = {
        'TSLA': 'tesla',
        'AAPL': 'apple',
        'MSFT': 'microsoft',
        'NVDA': 'nvidia',
        'GOOGL': 'google',
        'AMZN': 'amazon',
        'META': 'meta',
        'QQQ': 'qqq',
        'BRK.B': 'berkshire'
    };
    return codeMap[code] || code.toLowerCase();
}

// 更新股票显示
function updateStockDisplay(stockKey, data, isCached = false) {
    const priceElement = document.getElementById(`${stockKey}-price`);
    const changeElement = document.getElementById(`${stockKey}-change`);
    const cardElement = document.getElementById(stockKey);
    
    if (!priceElement || !changeElement || !cardElement) {
        console.error(`找不到${stockKey}的DOM元素`);
        return;
    }
    
    // 更新价格
    priceElement.textContent = `$${data.price.toFixed(2)}`;
    
    // 更新涨跌信息
    const changeValue = data.change >= 0 ? `+${data.change.toFixed(2)}` : data.change.toFixed(2);
    const changePercentValue = data.changePercent >= 0 ? `+${data.changePercent.toFixed(2)}%` : `${data.changePercent.toFixed(2)}%`;
    
    // 如果是缓存数据，添加标识
    if (isCached) {
        changeElement.textContent = `${changeValue} (${changePercentValue}) [缓存]`;
    } else {
        changeElement.textContent = `${changeValue} (${changePercentValue})`;
    }
    
    // 设置涨跌颜色
    changeElement.className = 'price-change';
    if (data.change > 0) {
        changeElement.classList.add('price-up');
    } else if (data.change < 0) {
        changeElement.classList.add('price-down');
    } else {
        changeElement.classList.add('price-neutral');
    }
    
    // 如果是缓存数据，添加特殊样式
    if (isCached) {
        cardElement.classList.add('cached-data');
        cardElement.classList.remove('loading', 'error-state');
    } else {
        cardElement.classList.remove('loading', 'error-state', 'cached-data');
    }
    
    // 添加更新动画
    cardElement.style.transform = 'scale(1.02)';
    setTimeout(() => {
        cardElement.style.transform = 'scale(1)';
    }, 200);
}

// 显示股票错误状态
function showStockError(stockKey, errorMessage) {
    const priceElement = document.getElementById(`${stockKey}-price`);
    const changeElement = document.getElementById(`${stockKey}-change`);
    const cardElement = document.getElementById(stockKey);
    
    if (priceElement) priceElement.textContent = '--';
    if (changeElement) {
        // 根据错误类型显示不同的信息
        let errorText = '数据获取失败';
        if (errorMessage && errorMessage.includes('Key')) {
            errorText = 'API Key错误';
        } else if (errorMessage && errorMessage.includes('超时')) {
            errorText = '请求超时';
        } else if (errorMessage && errorMessage.includes('网络')) {
            errorText = '网络错误';
        }
        
        changeElement.textContent = errorText;
        changeElement.className = 'price-change price-neutral';
    }
    if (cardElement) {
        cardElement.classList.add('error-state');
        cardElement.classList.remove('loading');
    }
}

// 更新状态指示器
function updateStatus(text, status) {
    if (elements.statusText) {
        elements.statusText.textContent = text;
    }
    
    if (elements.statusDot) {
        elements.statusDot.className = 'status-dot';
        if (status === 'connected') {
            elements.statusDot.classList.add('connected');
        } else if (status === 'error') {
            elements.statusDot.classList.add('error');
        }
    }
}

// 更新最后更新时间
function updateLastUpdateTime() {
    if (elements.lastUpdate) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        elements.lastUpdate.textContent = `最后更新: ${timeString}`;
    }
}

// 手动刷新数据
async function manualRefresh() {
    try {
        updateStatus('刷新中...', 'connecting');
        await fetchStockData();
    } catch (error) {
        console.error('刷新失败:', error);
        updateStatus('刷新失败', 'error');
    }
}

// 添加键盘快捷键支持（车机大屏可能没有鼠标）
document.addEventListener('keydown', function(event) {
    switch(event.key) {
        case 'r':
        case 'R':
            // R键刷新数据
            event.preventDefault();
            manualRefresh();
            break;
        case 'Escape':
            // ESC键重置状态
            event.preventDefault();
            updateStatus('已连接', 'connected');
            break;
    }
});

// 错误处理
window.addEventListener('error', function(event) {
    console.error('应用错误:', event.error);
    updateStatus('应用错误', 'error');
});

// 网络状态监听
window.addEventListener('online', function() {
    console.log('网络已连接');
    if (!isConnected) {
        fetchStockData();
    }
});

window.addEventListener('offline', function() {
    console.log('网络已断开');
    updateStatus('网络断开', 'error');
    isConnected = false;
});

// 页面卸载时清理
window.addEventListener('beforeunload', function() {
    if (updateInterval) {
        clearInterval(updateInterval);
    }
});

// 导出函数供调试使用
window.stockApp = {
    fetchStockData,
    updateStatus,
    stockData
};