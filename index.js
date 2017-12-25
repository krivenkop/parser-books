var request = require('request');
var tress = require('tress');
var fs = require('fs');
var cheerio = require('cheerio');
var needle = require('needle');
var decode = require('unescape');

var URL = 'https://www.livelib.ru/books/top/listview/biglist';
var URI = 'https://www.livelib.ru';
var results = [];

var q = tress((url, callback) => {
  request(url, (err, res, body) => {
    if (err) throw err;

    const $ = cheerio.load(body, { decodeEntities: true });
    var link = '';
    var currentObject = {};

    $('.book-container.biglist')
      .children('div')
      .each(function(index, el) {
        currentObject = {};

        currentObject.link =
          URI +
          $(this)
            .find('.event-data-title')
            .find('a.block-book-title')
            .attr('href');
        currentObject.name = $(this)
          .find('.event-data-title')
          .find('a.block-book-title')
          .text();
        currentObject.shortAuthor = $(this)
          .find('.event-data-title')
          .find('.block-book-author')
          .text();
        currentObject.linkAuthor =
          URI +
          $(this)
            .find('.event-data-title')
            .find('.block-book-author')
            .attr('href');
        currentObject.imgPath = $(this)
          .find('.boocover')
          .children('img')
          .attr('src');

        console.log(currentObject);
        results.push(currentObject);
      });

    callback();
  });
});

q.drain = function() {
  require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
};

q.push(URL);
