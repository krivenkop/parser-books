var request = require('request');
var tress = require('tress');
var fs = require('fs');
var cheerio = require('cheerio');
var needle = require('needle');
var decode = require('unescape');

var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

var q = tress((inputData, callback) => {
  request(inputData.link, (err, res, body) => {
    if (err) throw err;

    const $ = cheerio.load(body, { decodeEntities: true });
    var currentObject = {};
    var currentGenres = [];

    $('.label-genre').each((index, el) => {
      currentGenres.push($(this).text());
    });

    callback();
  });
});

q.drain = function() {
  require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
};

for (var i in data) {
  q.push(data[i]);
}
