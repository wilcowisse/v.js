/**
 * COUNT #REPOS
 */

var esprima = require('esprima');

var fs = require('fs');
var path = require('path');
var futil = require('./fsutil.js');


var count = 0;

var authors = futil.getDirList('objects');
authors.forEach(function(author){

    var repos = futil.getDirList(path.join('objects',author));
    repos.forEach(function(repo){
        count++;
        
    });

});



console.log(count+'\n');

