var request = require('request');
var tress = require('tress');
var fs = require('fs');
var cheerio = require('cheerio');
var needle = require('needle');
var decode = require('unescape');

var data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

var q = tress((inputData, callback) => {
  request(inputData.data.link, (err, res, body) => {
    if (err) throw err;

    const $ = cheerio.load(body, { decodeEntities: true });
    var currentObject = {};
    var currentGenres = [];

    $('.label-genre').each((index, el) => {
      currentGenres.push($(el).text());
    });

    console.log(currentGenres);
    data[inputData.index].genres = [...currentGenres];

    callback();
  });
});

q.drain = function() {
  require('fs').writeFileSync('./authors.json', JSON.stringify(data, null, 4));
};

for (var i in data) {
  q.push({ data: data[i], index: i });
}
