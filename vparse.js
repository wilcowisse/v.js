/** CHECK WHETHER FILES ARE PARSABLE IN REPO **/

var esprima = require('esprima');
var fs = require('fs');
var path = require('path');
var refactor = require('./refactor.js');
var vutil = require('./util.js');
var futil = require('./fsutil.js');
var measurementBuilder = require('./measurementbuilder.js');
var traverse = require('ast-traverse');

/****/
var inputDir  = 'jupiterjs';
/****/

var repos = futil.getDirList(inputDir);
repos.forEach(function(repo){

    console.log('Repo: ');
    var files = futil.getJSFileList(path.join(inputDir,repo));
    files.forEach(function(file){
        console.log('  '+file);
        
        var filename = path.join(inputDir,repo,file);
        var raw = fs.readFileSync(filename,'utf-8');
        raw = raw.replace(/^#!.*\n/,'\n');
        
        try{  
            var ast=esprima.parse(raw,{range:true,loc:true});
            refactor(raw,ast,true);
        }
        catch(error){
            console.log("ERROR:" + error.message +'\n');
            debugger;
        }
    });
    
});


