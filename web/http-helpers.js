var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
  var encoding = { encoding: 'utf8' };

  fs.readFile(archive.paths.siteAssets + asset, encoding, function(err, data) {
    if (err) {
      fs.readFile(archive.paths.archivedSites + asset, encoding, function(err, data) {
        if (err) {
          callback ? callback() : exports.send404(res);
        } else {
          exports.sendResponse(res, data);
        }
      });
    } else {
      exports.sendResponse(res, data);
    }
  });
};

// As you progress, keep thinking about what helper functions you can put here!
exports.sendResponse = function(response, obj, status) {
  status = status || 200;
  response.writeHead(status, exports.headers);
  response.end(obj);
};

exports.collectData = function(request, callback) {
  var data = '';
  request.on('data', (chunk) => {
    data += chunk;
  });
  request.on('end', () => {
    callback(data);
  });
};

exports.send404 = function(response) {
  exports.sendResponse(response, '404: Page  Not Found', 404);
};

exports.sendRedirect = function(response, location, status) {
  status = status || 302;
  response.writeHead(status, {Location: location});
  response.end();
};