// 打开百度并截图
const puppeteer = require('puppeteer');
const getBaidu = async() => {
    const browser = await puppeteer.launch({
        headless: false // 关闭无头模式
    })
    const page = await browser.newPage()
    await page.goto('http://www.baidu.com/')
    await page.screenshot({path: 'baidu.png'})
    await browser.close()
}
// getBaidu();

const { extractDataFromPerformanceTiming } = require('./help');

// 获取性能详情
const getPorformanceDetail = async (network, link) => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    // 网络状况 0 wifi 1: Regular 4G  2:Goods 3G 3: Regular3G
    let status = {};
    switch (+network) {
      case 0:
        status = {
          offline: false,
          latency: 2,
          downloadThroughput: 30000 * 1024 / 8, // 30000kb/s
          uploadThroughput: 15000 * 1024 / 8 // 30000kb/s
        };
        break;
      case 1:
        status = {
          offline: false,
          latency: 20,
          downloadThroughput: 4000 * 1024 / 8,
          uploadThroughput: 3000 * 1024 / 8
        };
        break;
      case 2:
        status = {
          offline: false,
          latency: 40,
          downloadThroughput: 1000 * 1024 / 8,
          uploadThroughput: 750 * 1024 / 8
        };
        break;
      case 3:
        status = {
          offline: false,
          latency: 100,
          downloadThroughput: 750 * 1024 / 8,
          uploadThroughput: 250 * 1024 / 8
        };
        break;

      default:
        break;
    }
    // await page.setCacheEnabled(false);
    await page._client.send('Network.enable');
    await page._client.send('Network.emulateNetworkConditions', status);
    // 清除页面缓存
    await page._client.send('Network.clearBrowserCache');
    await page.goto(link);
    const performanceTiming = JSON.parse(
      await page.evaluate(() => JSON.stringify(window.performance.timing))
    );
    await page.close();

    const result = extractDataFromPerformanceTiming(
      performanceTiming,
      'responseStart', // 返回浏览器从服务器收到（或从本地缓存读取）第一个字节时的Unix毫秒时间戳。
      'responseEnd', // 返回浏览器从服务器收到（或从本地缓存读取）最后一个字节时（如果在此之前HTTP连接已经关闭，则返回关闭时）的Unix毫秒时间戳。
      'domInteractive', // 返回当前网页DOM结构结束解析、开始加载内嵌资源时（即Document.readyState属性变为“interactive”、相应的readystatechange事件触发时）的Unix毫秒时间戳。
      'domContentLoadedEventEnd', // 返回当前网页DOMContentLoaded事件发生时（即DOM结构解析完毕、所有脚本开始运行时）的Unix毫秒时间戳。
      'loadEventEnd' // 返回当前网页load事件的回调函数运行结束时的Unix毫秒时间戳。如果该事件还没有发生，返回0。
    );
    console.log(result);
    return result;
  }
const result = getPorformanceDetail(1, 'https://www.baidu.com')