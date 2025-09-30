# 股票实时价格 - 车机大屏版

一个专为车机大屏设计的股票实时价格展示网页，支持9只热门股票的实时价格显示，使用Polygon.io HTTP REST API获取真实股票数据。

## 功能特点

- 🚗 **车机大屏优化**: 专为大屏显示设计，支持1920x1080及以上分辨率
- 📊 **真实数据**: 使用Polygon.io HTTP REST API获取实时股票数据
- 🎨 **简洁大气**: 深色主题，红涨绿跌配色方案
- 🔄 **自动刷新**: 每5秒自动更新数据
- ⌨️ **键盘支持**: 支持R键刷新，ESC键重置
- 📱 **响应式设计**: 适配不同屏幕尺寸
- 🛡️ **智能缓存**: API失败时显示上一次成功获取的数据

## 支持的股票

- **特斯拉 (TSLA)** - ⚡ 电动汽车
- **苹果 (AAPL)** - 🍎 科技巨头
- **微软 (MSFT)** - 🪟 软件巨头
- **英伟达 (NVDA)** - 🎮 AI芯片
- **谷歌 (GOOGL)** - 🔍 搜索引擎
- **亚马逊 (AMZN)** - 📦 电商巨头
- **META (META)** - 📘 社交媒体
- **QQQ (QQQ)** - 📈 纳斯达克ETF
- **伯克希尔-B (BRK.B)** - 💰 巴菲特公司

## 快速开始

1. **获取Polygon.io API Key**
   - 访问 [Polygon.io官网](https://polygon.io/)
   - 注册账户并获取API Key

2. **配置API Key**
   - 打开 `config.js` 文件
   - 将您的API Key填入 `apiKey` 字段

3. **运行应用**
   - 直接在浏览器中打开 `index.html` 文件
   - 页面会自动获取并显示实时股价数据

4. **使用键盘快捷键**
   - `R` 键：手动刷新数据
   - `ESC` 键：重置状态

## Polygon.io API配置

### API Key配置

在 `config.js` 文件中配置您的Polygon.io API Key：

```javascript
const POLYGON_CONFIG = {
    // Polygon.io API基础URL
    baseUrl: 'https://api.polygon.io',
    
    // 您的Polygon.io API Key
    apiKey: '您的API Key', // 必填
    
    // 更新间隔（毫秒）
    updateInterval: 5000, // 5秒更新一次
    
    // 其他配置...
};
```

### 获取API Key

1. 访问 [Polygon.io官网](https://polygon.io/)
2. 注册免费账户或登录
3. 在控制台获取您的API Key
4. 将API Key配置到 `config.js` 文件中

### HTTP API说明

Polygon.io使用HTTP REST API提供股票数据：

- **请求方式**: GET
- **API地址**: `https://api.polygon.io/v2/aggs/ticker/{symbol}/prev`
- **认证方式**: API Key参数认证
- **请求参数**: 
  - `apikey`: 您的API Key
  - `adjusted`: 是否调整价格（默认true）
- **响应格式**: JSON

**请求示例**:
```
GET https://api.polygon.io/v2/aggs/ticker/AAPL/prev?adjusted=true&apikey=YOUR_API_KEY
```

**响应示例**:
```json
{
    "status": "OK",
    "ticker": "AAPL",
    "queryCount": 1,
    "resultsCount": 1,
    "adjusted": true,
    "results": [
        {
            "T": "AAPL",
            "v": 1234567,
            "vw": 180.5,
            "o": 179.2,
            "c": 180.5,
            "h": 181.0,
            "l": 178.5,
            "t": 1640995200000,
            "n": 1
        }
    ]
}
```

**数据字段说明**:
- `o`: 开盘价 (Open)
- `c`: 收盘价 (Close)
- `h`: 最高价 (High)
- `l`: 最低价 (Low)
- `v`: 成交量 (Volume)
- `t`: 时间戳 (Timestamp)

## 技术架构

### 前端技术
- **HTML5**: 语义化结构
- **CSS3**: 响应式设计，车机大屏优化
- **JavaScript**: HTTP请求，异步数据处理

### 数据源
- **Polygon.io HTTP REST API**: 获取真实股票数据
- **定时刷新**: 每5秒自动请求最新数据
- **智能缓存**: API失败时显示上一次成功获取的数据
- **缓存标识**: 缓存数据会显示"[缓存]"标识和橙色边框

## 开发说明

### 添加新股票

1. 在 `config.js` 的 `POLYGON_CONFIG.stocks` 中添加股票信息
2. 在 `index.html` 中添加股票卡片
3. 在 `style.css` 中添加对应的颜色主题
4. 在 `script.js` 的 `getStockKey` 函数中添加股票代码映射

**注意**: Polygon.io使用标准美股代码格式，例如：
- 美股：`AAPL`、`TSLA`、`MSFT`
- ETF：`QQQ`、`SPY`
- 特殊股票：`BRK.B`（伯克希尔-B）

### 自定义样式
- 修改 `style.css` 中的CSS变量
- 调整响应式断点
- 自定义颜色主题

### API配置
当前已集成Polygon.io HTTP REST API：
1. 在 `config.js` 中配置API Key
2. 修改 `POLYGON_CONFIG` 中的配置参数
3. 调整更新间隔和超时时间

## 文件结构

```
tesla_stock/
├── index.html          # 主页面
├── style.css          # 样式文件
├── script.js          # HTTP请求和数据处理逻辑
├── config.js          # Polygon.io API配置
├── test_api.html      # API测试页面
└── README.md          # 说明文档
```

## 浏览器兼容性

- Chrome 80+ (推荐)
- Firefox 75+
- Safari 13+
- Edge 80+

**注意**: 需要浏览器支持Fetch API

## 车机大屏优化

- 大字体显示，适合远距离观看
- 高对比度配色，确保在各种光线条件下清晰可见
- 简洁的界面设计，减少视觉干扰
- 支持触摸和键盘操作
- 自动定时刷新，无需手动操作

## 注意事项

- 当前版本使用Polygon.io HTTP REST API获取真实股票数据
- API失败时会显示上一次成功获取的数据（带缓存标识）
- 建议在HTTPS环境下部署以确保API安全
- API有使用限制，请合理使用
- 缓存数据会显示橙色边框和"[缓存]"标识
- 默认每5秒更新一次数据，可在配置文件中调整

## 故障排除

### 无法获取数据
1. 检查API Key是否正确配置
2. 确认网络连接正常
3. 检查浏览器控制台的错误信息
4. 确认股票代码格式正确（如 `AAPL`）

### 显示错误信息
1. 检查API Key是否有效
2. 确认API使用额度未超限
3. 查看浏览器控制台的详细错误
4. 尝试手动刷新（按R键）

### 数据更新缓慢
1. 检查网络速度
2. 调整更新间隔设置
3. 查看API响应时间

## 性能优化

- 使用HTTP请求，稳定可靠
- 智能缓存机制，减少错误显示
- 并发请求所有股票，提高效率
- 定时刷新，保持数据最新

## Polygon.io API特点

根据[Polygon.io文档](https://polygon.io/docs/rest/stocks/overview)，该API具有以下特点：

- **全面覆盖**: 覆盖美国所有19个主要交易所
- **实时数据**: 提供实时价格、历史数据
- **盘前盘后**: 支持盘前（4:00-9:30 AM）和盘后（4:00-8:00 PM）交易数据
- **高可靠性**: 直接连接交易所，数据准确及时
- **合规性**: 符合美国金融监管要求

## 参考资料

- [Polygon.io API文档](https://polygon.io/docs/rest/stocks/overview)
- [Polygon.io官网](https://polygon.io/)
- [Fetch API文档](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)