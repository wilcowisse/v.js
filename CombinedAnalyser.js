var ResultList  = require('./ResultList.js');

function CombinedAnalyser(name, acceptor, meters, meterNames) {
	this.name=name;
	this.accept=acceptor;
	this.meters=meters;
	this.meterNames=meterNames;
    this.resultLists = [];
    
    this.meters.forEach(function(meter){
        this.resultLists.push(new ResultList(meter.size));
    },this);
	
}
CombinedAnalyser.prototype.run = function(node){
	if(this.accept(node)) {
	    this.meters.forEach(function(meter,i){
            meter.run(node,this.resultLists[i]);
        },this);
	}
}
CombinedAnalyser.prototype.empty = function(){
    this.resultLists.forEach(function(resultList){
        resultList.empty();
    });
}
CombinedAnalyser.prototype.getResults = function(){
    return [].concat.apply([], this.resultLists.map(function(resultList){
	    return resultList.getResults();
	}));
}
CombinedAnalyser.prototype.getAbsoluteResults = function(){
    return [].concat.apply([], this.resultLists.map(function(resultList){
	    return resultList.getAbsoluteResults();
	}));
}
CombinedAnalyser.prototype.getLabels = function(indent_num){
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
    module.exports = CombinedAnalyser;
}
