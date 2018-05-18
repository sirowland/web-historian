var http = require('http');
var handler = require('./request-handler');
var initialize = require('./initialize.js');
var cron = require('node-cron');
var archive = require('../helpers/archive-helpers');

// Why do you think we have this here?
// HINT: It has to do with what's in .gitignore
initialize('./archives');

var port = 8080;
var ip = '127.0.0.1';
var server = http.createServer(handler.handleRequest);

if (module.parent) {
  module.exports = server;
} else {
  cron.schedule('* * * * *', function() {
    console.log('running cron job');
    archive.readListOfUrls(function(sites) {
      if (sites.length) {
        archive.downloadUrls(sites);
      }
    });
  });
  server.listen(port, ip);
  console.log('Listening on http://' + ip + ':' + port);
}

