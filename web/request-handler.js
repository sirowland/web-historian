var path = require('path');
var archive = require('../helpers/archive-helpers');
const fs = require('fs');

 
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  if (req.method === 'GET' && req.url === '/' ) {
    fs.readFile('./public/index.html', 'utf8', function(err, data) {
      res.end(data);
    });
  }
  
  if (req.method === 'POST' && req.url === '/' ) {

    var dataIn = [];

    req.on('data', function(data) {
      dataIn.push(data);
    }).on('end', function() {
      dataIn = dataIn.join('').split('').splice(4).join('');
    });  

    // archive.readListOfUrls(function(siteList) {
      
      
    // });
    
    fs.readFile('../archives/sites.txt', 'utf8', function(err, data) {
      var sites = data.length !== 0 ? data.split('\n') : [];
      
      if (sites.indexOf(dataIn) === -1) {
        fs.readFile('./public/loading.html', 'utf8', function(err, read) {
          console.log('sites', sites);

          sites.push(dataIn);
          sites = sites.join('\n');

          fs.writeFile( '../archives/sites.txt', sites, 'utf8', function(err) {
            res.end(read);
          });

        });
      }
    });
  }
  // res.end(archive.paths.list);
};


