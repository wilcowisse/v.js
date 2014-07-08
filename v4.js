/**
SELECT FEATURES (REMOVE FEATURES THAT ARE RARE IN THE WHOLE DATASET; EXPAND THOSE THAT ARE FREQUENT)
**/

var esprima = require('esprima');

var fs = require('fs');
var path = require('path');
var refactor = require('./refactor.js');
var vutil = require('./util.js');
var futil = require('./fsutil.js');
var measurementBuilder = require('./measurementbuilder.js');


/****/
var inputDir  = 'cleaned_export200grouped';
var outputDir = 'res';
var option = 'global'; // global/profilebased/instancebased
/****/

var parseErrors = [];
var solvedParseErrors = [];
var refactorErrors = [];
var measureErrors = [];

var measurement = measurementBuilder.build();
futil.createDir(outputDir);

var authors = futil.getDirList(inputDir);
authors.forEach(function(author){
    console.log('Analyzing '+author);
    if(option =='instancebased')
        futil.createDir(path.join(outputDir,author));
    
    var repos = futil.getDirList(path.join(inputDir,author));
    repos.forEach(function(repo){
        console.log(' '+repo);
        var files = futil.getJSFileList(path.join(inputDir,author,repo));
        files.forEach(function(file){
            console.log('  '+file);
            var success = true;
            //success = false;
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
                    refactor(raw,ast,true);
                }
            }
            catch(error){
                refactorErrors.push(file);
                success=false;
            }
            try{
                if(success){
                    measurement.runAst(ast);
                }    
            }
            catch(error){
                console.log('Refactor error: ' + file);
                measureErrors.push(file);
                success=false;
            }
        });
        
        if(option === 'instancebased'){
            measurement.flush(path.join(outputDir,author,repo+'.txt'));
        }
    });
    
    if(option === 'profilebased'){
        measurement.flush(path.join(outputDir,author+'.txt'));
    }

});

if(option === 'global'){
    writeBadFeatures(measurement);
    measurement.flush(path.join(outputDir,'global.txt'));
}

console.log('\n');
console.log('Parse errors: ' + parseErrors + ' '+ parseErrors.length + '\n');
console.log('Refactor errors: ' + refactorErrors + ' '+ refactorErrors.length + '\n');
console.log('Measure errors: ' + measureErrors + ' '+ measureErrors.length + '\n');
console.log('Solved parse errors: ' + solvedParseErrors + ' '+ solvedParseErrors.length + '\n');

function writeBadFeatures(measurement){
    var labels = measurement.getLabels(0).map(function(value){return value.substring(0,value.length-1);});
    var values = measurement.getAbsoluteResults();
    
    debugger;
    var remove = {};
    var expand = {};
    
    for(var i=0;i<labels.length;i++){
        if(values[i] < 18){ // 10% of 182 authors
            var pos  = labels[i].indexOf('=');
            var slot = labels[i].substring(0,pos);
            var cat  = labels[i].substring(pos+1);
            
            
            if(!vutil.endsWith(slot,'/*') || cat.indexOf(',') !== -1 || cat === 'Otherwise'){
                continue;
            }
            
            if(remove.hasOwnProperty(slot)){
                remove[slot].push(cat);
            }
            else{
                remove[slot] = [cat];
            }
        }
        else if(values[i]>=4374){ // one per repository
           var pos  = labels[i].indexOf('=');
           var slot = labels[i].substring(0,pos);
           var cat  = labels[i].substring(pos+1);
            if(expand.hasOwnProperty(slot)){
                expand[slot].push(cat);
            }
            else{
                expand[slot] = [cat];
            }
        }
    }
    
    var stream = fs.createWriteStream(path.join(outputDir,'remove.txt'));
    for(key in remove){
        if(remove.hasOwnProperty(key)){
            stream.write('\''+key+'\'' +' : '+ '[' +remove[key].map(function(value){return '"'+value+'"';}) +'],'+ '\n');
        }
    }
    stream.end();
    
    var stream2 = fs.createWriteStream(path.join(outputDir,'expand.txt'));
    for(key in expand){
        if(expand.hasOwnProperty(key)){
            stream2.write(key+'\n');
            var values = expand[key];
            var url = key.substring(0,key.length-1);
            values.forEach(function(value){
                stream2.write('\t'+url+value+'/*\n');
            });
            stream2.write('\n');
        }
    }
    stream2.end();

    
}
            

