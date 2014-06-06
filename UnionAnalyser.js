var ResultList  = require('./ResultList.js');

function UnionAnalyser(name, acceptor, meters, meterNames) {
	this.name=name;
	this.accept=acceptor;
	this.meters=meters;
	this.meterNames=meterNames;
	
	var size = meters.reduce(function(sum, meter) {
        return sum+meter.size;
    },0);
    
	this.resultList=new ResultList(size);
	
	this.offsets = new Array(meters.length);
	var offset = 0;
	for(var i=0;i<this.offsets.length;i++){
	    this.offsets[i]=offset;
	    offset+=meters[i].size;
	}
}
UnionAnalyser.prototype.run = function(node){
	if(this.accept(node)) {
	    this.meters.forEach(function(meter,i){
            var offset = this.offsets[i];
            this.resultList.setOffset(offset);
            meter.run(node,this.resultList);
        },this);
	}
}
UnionAnalyser.prototype.empty = function(){
    this.resultList.empty();
}
UnionAnalyser.prototype.getResults = function(){
    return this.resultList.getResults();
}
UnionAnalyser.prototype.getAbsoluteResults = function(){
    return this.resultList.getAbsoluteResults();
}
UnionAnalyser.prototype.getLabels = function(indent_num){
    var meterNames = this.meterNames;
    var allxLabels = [].concat.apply([], this.meters.map(function(meter,i){
	    return meter.xLabels.map(function(label){return meterNames[i]+label});
	}));
	
	var analyserName = this.name.replace(/\s/g,'_');
	var result = allxLabels.map(function(meterLabel){
	    var label = analyserName + '=' + meterLabel.replace(/\s/g,'_');
		var indentation = ' ';
		if(label.length < indent_num)
		    indentation = new Array(indent_num - label.length+1).join(' ');
		return label+indentation;
	},this);
	return result;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = UnionAnalyser;
}
