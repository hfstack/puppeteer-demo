const extractDataFromPerformanceTiming = (timing, ...dataNames) => {
    const navigationStart = timing.navigationStart;
  
    const extractedData = {};
    dataNames.forEach(name => {
      extractedData[name] = timing[name] - navigationStart;
    });
    // 解析 DOM 树结构的时间（反省下你的 DOM 树嵌套是不是太多了！）
    extractedData['domReady'] = timing.domComplete - timing.responseEnd;
    // 白屏时间
    extractedData['blankScreen'] = timing.responseStart - timing.navigationStart;
    // 重定向的时间（拒绝重定向！比如，http://example.com/ 就不该写成 http://example.com）
    extractedData['redirect'] = timing.redirectEnd - timing.redirectStart;
    // DNS 查询时间（DNS 预加载做了么？页面内是不是使用了太多不同的域名导致域名查询的时间太长？
    // 可使用 HTML5 Prefetch 预查询 DNS ，见：[HTML5 prefetch](http://segmentfault.com/a/1190000000633364)）
    extractedData['lookupDomain'] = timing.domainLookupEnd - timing.domainLookupStart;
    // 读取页面第一个字节的时间（这可以理解为用户拿到你的资源占用的时间，加异地机房了么，加CDN 处理了么？加带宽了么？加 CPU 运算速度了么？）
    // TTFB 即 Time To First Byte 的意思
    // 维基百科：https://en.wikipedia.org/wiki/Time_To_First_Byte
    extractedData['ttfb'] = timing.responseStart - timing.navigationStart;
    // 内容加载完成的时间（页面内容经过 gzip 压缩了么，静态资源 css/js 等压缩了么？）
    extractedData['request'] = timing.responseEnd - timing.requestStart;
    // 执行 onload 回调函数的时间（是否太多不必要的操作都放到 onload 回调函数里执行了，考虑过延迟加载、按需加载的策略么？）
    extractedData['loadEvent'] = timing.loadEventEnd - timing.loadEventStart;
    // DNS 缓存时间
    extractedData['appcache'] = timing.domainLookupStart - timing.fetchStart;
    // 卸载页面的时间
    extractedData['unloadEvent'] = timing.unloadEventEnd - timing.unloadEventStart;
    // TCP 建立连接完成握手的时间
    extractedData['connect'] = timing.connectEnd - timing.connectStart;
    return extractedData;
  };
  
  module.exports = {
    extractDataFromPerformanceTiming
  };
  