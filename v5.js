/** ANALYZE WITH BLAME INFO **/

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
var blameFile = 'jupiterjs/blameinfo.txt';
var outputDir = 'jupiterjs_features';
/****/

blameInfo = readBlameInfo(blameFile);
futil.createDir(outputDir);

console.log('Blame file read. Starting measurement\n');

var repos = futil.getDirList(inputDir);
repos.forEach(function(repo){
    // create measurements
    var authors = getAuthors(blameInfo,repo);
    var measurements = new Object();
    authors.forEach(function(author){
        measurements[author] = measurementBuilder.build();
    });
    
    console.log('Repo: ' + repo + ' ('+authors.join()+')');
    debugger;
    var files = futil.getJSFileList(path.join(inputDir,repo));
    files.forEach(function(file){
        console.log('  '+file);
        try{
            var raw = fs.readFileSync(path.join(inputDir,repo,file),'utf-8');
            raw = raw.replace(/^#!.*\n/,'\n');
            var ast=esprima.parse(raw,{range:true,loc:true});
            refactor(raw,ast,true);
            
            var fileName = file.substring(file.lastIndexOf('#')+1);
	        traverse(ast, {
		        pre: function(node,parent) {
		            //debugger;
		            var nodeRange;
		            if(node.hasOwnProperty('loc')){
    		            nodeRange = [node.loc.start.line,node.loc.end.column==0?node.loc.end.line-1:node.loc.end.line];
		            }
		            else{
		                while(parent.loc == undefined) parent = parent.$parent;
		                nodeRange = [parent.loc.start.line, parent.loc.end.column==0?parent.loc.end.line-1:parent.loc.end.line];
		            }
		            
		            authors.filter(function(author){
		                debugger;
		                return blameInfo[repo][fileName] != undefined && blameInfo[repo][fileName][author] != undefined;
		            }).forEach(function(author){
		                debugger;
		                var ranges = blameInfo[repo][fileName][author];
		                if(isInRange(nodeRange,ranges)){
		                    measurements[author].runNode(node);
		                }
		            });
		        }
	        });
        }
        catch(error){
            console.log("ERROR:" + error.message +'\n');
            debugger;
            process.exit(1);
        }
    
    });
    
    authors.forEach(function(author){
        futil.createDir(path.join(outputDir,author));
        measurements[author].flush(path.join(outputDir,author,repo+'.txt'));
    });
    
});


function readBlameInfo(path){
    var reposObj = new Object();
    var blameFile = fs.readFileSync(path,'utf-8');
    var lines = blameFile.split('\n');
    
    lines.forEach(function(line){
        var elements = line.split(' ');
        if(elements.length === 4){
            var author = elements[0];
            var repo   = elements[1].substring(elements[1].indexOf('#')+1,elements[1].lastIndexOf('#'));
            var file   = elements[1].substring(elements[1].lastIndexOf('#')+1);
            var range  = [Number(elements[2])+1,Number(elements[3])+1];
            
            if(!reposObj.hasOwnProperty(repo)){
                reposObj[repo] = new Object();
                reposObj[repo][file] = new Object();
                reposObj[repo][file][author] = new Array();
            }
            else{
                if(!reposObj[repo].hasOwnProperty(file)){
                    reposObj[repo][file] = new Object();
                    reposObj[repo][file][author] = new Array();
                }
                else if(!reposObj[repo][file].hasOwnProperty(author)){
                    reposObj[repo][file][author] = new Array();
                }
            }
            reposObj[repo][file][author].push(range);
        }
    });
    
    return reposObj;
}

function getAuthors(blameInfo,repo){
    var authors = [];
    for(var file in blameInfo[repo]) {
        if(blameInfo[repo].hasOwnProperty(file)){
            Object.keys(blameInfo[repo][file]).forEach(function(author){
                if(authors.indexOf(author) === -1){
                    authors.push(author);
                }
            });
       }
    }
    return authors;
}



/**
  * Tests whether nodeRange fits one of the ranges
  */
function isInRange(nodeRange,ranges){
    return ranges.some(function(range){
        return nodeRange[0] >= range[0] && nodeRange[1] <= range[1];
    });
}

