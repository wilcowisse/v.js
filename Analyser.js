var ResultList  = require('./ResultList.js');

/*** Analyser ***/
function Analyser(name, acceptor, meter) {
	this.name=name;
	this.accept=acceptor;
	this.meter=meter;
	this.resultList=new ResultList(meter.size);
}
Analyser.prototype.run = function(node){
	if(this.accept(node)) {
		this.meter.run(node,this.resultList);
	}
}
Analyser.prototype.empty = function(){
    this.resultList.empty();
}
Analyser.prototype.getResults = function(){
    return this.resultList.getResults();
}
Analyser.prototype.getAbsoluteResults = function(){
    return this.resultList.getAbsoluteResults();
}
Analyser.prototype.getLabels = function(indent_num){
    var analyserName = this.name.replace(/\s/g,'_');
	var result = this.meter.xLabels.map(function(meterLabel){
		var label = analyserName + '=' + meterLabel;
		var indentation = ' ';
		if(label.length < indent_num)
		    indentation = new Array(indent_num - label.length+1).join(' ');
		return label+indentation;
	},this);
	return result;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = Analyser;
}
