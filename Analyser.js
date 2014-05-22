/*** Analyser ***/
function Analyser(name, acceptor, meter,pointer) {
	this.name=name;
	this.accept=acceptor;
	this.meter=meter;
	this.pointer=pointer;
}
Analyser.prototype.run = function(node){
	if(this.accept(node)) {
		this.meter.run(node,this.pointer);
	}
}
Analyser.prototype.getLabels = function(indent_num){
	var result = this.meter.xLabels.map(function(meterLabel){
		var label =  this.name + '.' + meterLabel;
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
