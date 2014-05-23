
var Analyser = require('./Analyser.js');
var accepts = require('./acceptor.js');
var traverse = require('ast-traverse');

/*** Measurement ***/
function Measurement(){
	this.analysers=[];
}
Measurement.prototype.addAnalysis = function(description, acceptorUrl, meter) {
	var analyser = new Analyser(description, accepts(acceptorUrl),meter);
	this.analysers.push(analyser);
	return this;
}
Measurement.prototype.empty = function(){
	this.analysers.forEach(function(analyser){analyser.empty();});
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
	return [].concat.apply([],this.analysers.map(function(analyser){
	    return analyser.getLabels(indent_num);
	}));
}
Measurement.prototype.getResults = function(){
	return [].concat.apply([],this.analysers.map(function(analyser){
	    return analyser.getResults();}
	));
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = Measurement;
}
