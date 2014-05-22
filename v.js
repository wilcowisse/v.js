var esprima = require('esprima');
var traverse = require('ast-traverse');
var fs = require('fs');
var refactor = require('./refactor.js');
var vutil = require('./util.js');
var measurementBuilder = require('./measurementbuilder.js');

function getFileList(dir){
	try{
		var fileList=fs.readdirSync(dir)
			.filter(function(value){
				var suffix=".js";
				return value.indexOf(suffix, value.length - suffix.length) !== -1;
			})
			.map(function(value){
				return dir.lastIndexOf('/')==dir.length-1 ? dir+value : dir+"/"+value;
			});
	}
	catch(error){
		console.log("FILE SYSTEM ERROR:" + error.message);
	}
	return fileList;
}


var fileList=getFileList('./input');
var measurement = measurementBuilder.build();

fileList.forEach(function(filename){
	try{
		var raw = fs.readFileSync(filename,'utf-8');
		var ast=esprima.parse(raw,{range:true,loc:true});
	}
	catch(error){
		console.log("PARSE ERROR: "+error.message);
	}
	
	refactor(raw,ast,false);
	//vutil.printAst(ast, false, true);
	
	measurement.runAst(ast);
	
	var labels = measurement.getLabels(100);
	var values = measurement.getResults();
	if(labels.length!==values.length) debugger;
	
	for(var i=0;i<labels.length;i++){
		var value = values[i] === undefined ? NaN : values[i];
		console.log(labels[i]+value);
	}
	
});



