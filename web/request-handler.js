var path = require('path');
var archive = require('../helpers/archive-helpers');
const fs = require('fs');
const utils = require('./http-helpers');
var urlParser = require('url');

var actions = {
  'GET': function(req, res) {
    var parts = urlParser.parse(req.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    utils.serveAssets(res, urlPath);
  },
  'POST': function(req, res) {
    utils.collectData(req, function(data) {
      archive.isUrlInList(data, function(isFoundSites) {
        var url = data.substring(4);

        if (isFoundSites) {
          archive.isUrlArchived(url, function(isFoundArchive) {
            if (isFoundArchive) {
              utils.sendRedirect(res, '/' + url);
            } else {
              utils.sendRedirect(res, '/loading.html');
            }
          });
        } else {
          archive.addUrlToList(url, function() {
            utils.sendRedirect(res, '/loading.html');
          });
        }
      })
    });
  }
}; 

// require more modules/folders here!
exports.handleRequest = function (req, res) {
  var action = actions[req.method];

  if (action) {
    action(req, res);
  } else {
    utils.sendResponse(res, 'Not Found', 404);
  }
};

