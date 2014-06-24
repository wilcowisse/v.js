var esprima = require('esprima');
var fs = require('fs');
var path = require('path');
var escodegen = require('escodegen');
var esmangle = require('esmangle');

var futil = require('./fsutil.js');
/****/
var inputDir  = 'cleaned_export200grouped';
var outputDir = 'minified';
/****/

var parseErrors = [];
var solvedParseErrors = [];
var minifyErrors = [];

var compression = [];

futil.createDir(outputDir);

var authors = futil.getDirList(inputDir);
authors.forEach(function(author){
    console.log('Minifying '+author);

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
                    success=false;
                }
            }
            try{
                if(success){
                    var rawMin = minify(ast);
                    compression.push([file, raw.length,rawMin.length]);
                    fs.writeFileSync(path.join(outputDir,author,repo,file), rawMin); 
                }
            }
            catch(error){
                console.log('Minify error: ' + file); 
                minifyErrors.push(file);
                success=false;
                
            }
        });
    });
});

console.log('\n');
console.log('Parse errors: ' + parseErrors + ' '+ parseErrors.length + '\n');
console.log('Solved parse errors: ' + solvedParseErrors + ' '+ solvedParseErrors.length + '\n');
console.log('Minify errors: ' + minifyErrors + ' '+ minifyErrors.length + '\n');

var stream = fs.createWriteStream(path.join(outputDir,'compression.txt'));
compression.forEach(function(value){
    stream.write(value+'\n');
});
stream.end();

function minify(ast){
    var optimized = esmangle.optimize(ast, null);
    var mangled = esmangle.mangle(optimized);
    return escodegen.generate(mangled, {
        format: {
            indent: {
                style: ''
            }, 
            quotes: 'auto',
            compact: true,
        }
    });
}

