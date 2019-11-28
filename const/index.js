const cheerio = require('cheerio');
const http = require('request');

function getMainMesg(url) {
  http('https://m.xzw.com/fortune/gemini/', function(err, result) {
    if (err) {
      throw err;
    }
    const $ = cheerio.load(result.body);
    const elements = $('article.cont h2');
    elements.each((index, msg) => {
      console.log($(msg).text());
    });
    const program = $('article.cont p');
    program.each((index, msg) => {
      console.log($(msg).text());
    })
    const index = $('.index .layer');
    index.each((i, ele) => {
      console.log($(ele).text());
    });
  })
}
getMainMesg();