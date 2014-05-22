var Pointer  = require('./Pointer.js');
var Analyser = require('./Analyser.js');
var accepts = require('./acceptor.js');
var traverse = require('ast-traverse');

/*** Measurement ***/
function Measurement(){
	this.results=[];
	this.analysers=[];
	this.offset=-1;
}
Measurement.prototype.addAnalysis = function(description, acceptorUrl, meter) {
	var pointer = new Pointer(this.results, this.offset+1, meter.size);
	var analyser = new Analyser(description, accepts(acceptorUrl),meter,pointer);
	this.analysers.push(analyser);
	this.offset += meter.size;
	this.results.length=this.offset+1;
	return this;
}
Measurement.prototype.emptyResults = function(){
	this.results.length=0;
}
Measurement.prototype.runNode = function(node){
	this.analysers.forEach(function(analyser){analyser.run(node);});
}
Measurement.prototype.runAst = function(ast_obj){
	var runNode=this.runNode.bind(this);
	traverse(ast_obj, {
		pre: function(node) {
			runNode(node);
		}
	});
}
Measurement.prototype.getLabels= function(indent_num) {
	return [].concat.apply([],this.analysers.map(function(analyser){return analyser.getLabels(indent_num);}));
}
Measurement.prototype.getResults = function(){
	return this.results;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = Measurement;
}
