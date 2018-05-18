var http = require('http');
var fs = require('fs');
var headers = require('../web/http-helpers').headers;
var archive = require('../helpers/archive-helpers');

module.exports = function(url) {

  http.get({
    host: url,
    headers: headers
  }, function(res) {
    
    var body = '';

    res.on('data', (chunk) => {
      body += chunk;
      console.log(body);
    });

    res.on('end', () => {
      fs.writeFile(archive.paths.archivedSites + '/' + url, body, (err) => {if (err) throw err});
    });
  });
};