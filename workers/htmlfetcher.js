var http = require('http');
var fs = require('fs');
var options = {
  host: 'www.google.com',
  port: 80,
  path: '/index.html'
};
exports.fetchHtml = function(url) {
  http.get(options, function(res) {
    console.log(res);
  }).on('error', function(err) {
    console.log('Got error: ' + err.message);
  });
};