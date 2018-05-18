var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var fetchHtml = require('../workers/htmlfetcher.js');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../web/archives/sites'),
  list: path.join(__dirname, '../web/archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  var sitesArr = [];
  fs.readFile(exports.paths.list, function(err, data) {
    if (data) {
      sitesArr = data.toString().split('\n');
      sitesArr.pop();
    }

    if (callback) {
      callback(sitesArr);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  // fs.readFile(exports.paths.list, function(err, data) {
  //   if (data) {
  //     if (data.toString().split('\n').indexOf(url) !== -1) {
  //       callback(true);
  //     } else {
  //       callback(false);
  //     }
  //   }
  // });
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site, i) {
      return site.match(url);
    });
    callback(found);
  });
};

exports.addUrlToList = function(url, callback) {
  console.log('here')
  fs.appendFile(exports.paths.list, url + '\n', function(err, file) {
    if (err) throw err;
    console.log('appended file')
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  var sitePath = path.join(exports.paths.archivedSites, url);

  fs.access(sitePath, function(err) {
    callback(!err);
  });
};

exports.downloadUrls = function(urls) {
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i];
    exports.isUrlArchived(url, function(isFound) {
      if (!isFound) {
        fetchHtml(url);
      }
    });
  }
};





















