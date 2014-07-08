/*
    DELETE FILES THAT CANNOT BE PARSED

*/

var esprima = require('esprima');
var fs = require('fs');
var path = require('path');

var futil = require('./fsutil.js');
/****/
var inputDir  = 'cleaned_export200grouped';
var outputDir = 'minified';
/****/

var parseErrors = [];
var solvedParseErrors = [];

var compression = [];

futil.createDir(outputDir);

var authors = futil.getDirList(inputDir);
authors.forEach(function(author){
    console.log('Analyzing '+author);

    futil.createDir(path.join(outputDir,author));
    
    var repos = futil.getDirList(path.join(inputDir,author));
    repos.forEach(function(repo){
        console.log(' '+repo);
        futil.createDir(path.join(outputDir,author,repo));
        var files = futil.getJSFileList(path.join(inputDir,author,repo));
        files.forEach(function(file){
            var success = true;
            try{
                var filename = path.join(inputDir,author,repo,file);
                var raw = fs.readFileSync(filename,'utf-8');
                raw = raw.replace(/^#!.*\n/,'');
            }
            catch(error){
                console.log("FILE SYSTEM ERROR (f):" + error.message);
                success = false;
            }
            
            try{
                if(success){
                    var ast=esprima.parse(raw,{range:true});
                }
            }
            catch(e){
                var solved = false;
                
                var error = e;
                for(var i=0;i<10;i++){
                    var regexpMatch = error.message.match(/^.*Line (\d+):/);
                    if(regexpMatch != null && Number(regexpMatch[1]) != NaN){
                        var lineNumber =  Number(regexpMatch[1]);
                        raw = raw.split("\n").slice(lineNumber).join("\n");
                    }
                    else{
                        break;
                    }
                    try{
                        ast=esprima.parse(raw,{range:true});
                        solved=true;
                        break;
                    }
                    catch(e){
                        error = e;
                    }
                }
                if(solved){
                    solvedParseErrors.push(file);
                }
                else{
                    parseErrors.push(file);
                    fs.unlinkSync(path.join(inputDir,author,repo,file));
                    success=false;
                }
            }
        });
    });
});

console.log('\n');
console.log('Parse errors: ' + parseErrors + ' '+ parseErrors.length + '\n');
console.log('Solved parse errors: ' + solvedParseErrors + ' '+ solvedParseErrors.length + '\n');


