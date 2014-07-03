/**
 * COUNT #REPOS
 */

var esprima = require('esprima');

var fs = require('fs');
var path = require('path');
var futil = require('./fsutil.js');


var count = 0;
var inputDir = 'cleaned_export200grouped'

var authors = futil.getDirList(inputDir);
authors.forEach(function(author){

    var repos = futil.getDirList(path.join(inputDir,author));
    repos.forEach(function(repo){
        count++;
        
    });

});



console.log(count+'\n');

