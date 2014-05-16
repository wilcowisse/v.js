var esprima = require('esprima');
var traverse = require("ast-traverse");
var fs = require('fs');
var refactor = require('./refactor.js');
var measure = require('./measure.js');

var vutil = require("./util.js");

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
		console.log("ERROR:" + error.message);
	}
	return fileList;
}


fileList=getFileList('./input');

fileList.forEach(function(filename){
	try{
		var raw = fs.readFileSync(filename,'utf-8');
		var ast=esprima.parse(raw,{range:true,loc:true});
	}
	catch(error){
		console.log(error.message);
	}
	
	refactor(raw,ast);
	//measure(ast);
	vutil.printAst(ast, false, true);
	
});





