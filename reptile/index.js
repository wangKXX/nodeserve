const cheerio = require('cheerio');
const http = require('request');
const iconv = require('iconv-lite');
const redisTools = require('../redis/tools');

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
      const href = $(el).find('a').attr('href');
      hotNews.push({ title: $(ele).text(), href });
    });
    redisTools.setString('hotNews', JSON.stringify(hotNews));
  });
}

module.exports = getBaiDuHotNews;