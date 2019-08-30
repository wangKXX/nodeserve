const cheerio = require('cheerio');
const http = require('request');
const iconv = require('iconv-lite');

// 爬取百度及时新闻列表
function getBaiDuHotNews() {
  http('http://news.baidu.com/ent', function (err, result) {
    if (err) {
      throw err;
    }
    const $ = cheerio.load(result.body);
    const hotNewsEle = $('ul.ulist.mix-ulist li');
    const hotNews = [];
    hotNewsEle.each((index, ele) => {
      const href = $(ele).find('a').attr('href');
      hotNews.push({ title: $(ele).text(), href });
    });
    process.send(JSON.stringify(hotNews));
    process.exit(); // 处理完成退出子进程
  });
}

getBaiDuHotNews();
process.on('message', mesg => {
  console.log(mesg);
});