

/*** Meters ***/


function CountMeter() {
	this.size=1;
	this.xLabels=['count'];
}
CountMeter.prototype.run=function(node,pointer){
	pointer.increment(0);
}

function DistributionMeter(nodeProperty,valueList){
	this.valueList=valueList;
	this.property=nodeProperty;
	this.size=valueList.length;
	this.xLabels=valueList.map(function(value){return String(value)});
}
DistributionMeter.prototype.run=function(node,pointer){
	var valueList = this.valueList;
	var property = this.property;
	
	if(node === undefined || node === null){
	    debugger;
		throw new Error("Type of node is undefined: " + typeof node);
	}
	if(typeof node[property] !== 'string'){
	    debugger;
		throw new Error('Wrong node type');
	}
	
	var matched = false;
	for(var i=0;i<valueList.length;i++){
		var value = valueList[i];
		if((typeof value === 'string' && value === node[property]) || (Array.isArray(value) && value.indexOf(node[property]) != -1)){
			pointer.increment(i);
			matched = true;
			break;
		}
	}
	
	if(!matched) {
		var index = valueList.indexOf("Otherwise");
		if(index !== -1){
			pointer.increment(index);
			matched=true;
		}
	}
	
	if(!matched){
	    debugger;
		throw new Error("No match found");
	}
}

function ParentDistributionMeter(nodeProperty, valueList){
    this.distributionMeter = new DistributionMeter(nodeProperty,valueList);
}
ParentDistributionMeter.prototype.run=function(node,pointer){
    if(node.$parent != null){
        distributionMeter.run(node.$parent,pointer);
    }
}

function ChildLengthMeter(property,rangeList){
    this.rangeList = rangeList;
	this.property = property;
	this.size=rangeList.length;
	this.xLabels=rangeList.map(String);
}
ChildLengthMeter.prototype.run = function(node,pointer){
    if(node === undefined || node === null){
	    debugger;
		throw new Error("Type of node is undefined: " + typeof node);
	}
	if(typeof node[property] !== 'string' && !Array.isArray(node[property])){
	    debugger;
		throw new Error('Wrong node type');
	}
	
	var length = node[property].length;
	
	for(var i=0;i<rangeList.length;i++){
	    if(rangeList[i].length != 2){
	        debugger;
	        throw new Error('Illegal range param');
	    }
	    var minVal = range[0];
	    var maxVal = range[1];
	    
	    if(length>=minVal && length<=maxVal){
	        pointer.increment(i);
	    }
	}
}

function StringPatternMeter(propery,patternList){
    this.patternList = patternList;
    this.property = property;
	this.size=rangeList.length;
	this.xLabels=rangeList.map(String);
}
StringPatternMeter.prototype.run = function(node,pointer){
    if(node === undefined || node === null){
	    debugger;
		throw new Error("Type of node is undefined: " + typeof node);
	}
	if(typeof node[property] !== 'string'){
	    debugger;
		throw new Error('Wrong node type');
	}
	
	for(var i=0;i<patternList.length;i++){
	    if(patternList[i].test(node[property])){
	        pointer.increment(i);
	    }
	}
}

function DescendantCountMeter(property,rangeList){
    this.rangeList = rangeList;
	this.property = property;
	this.size=rangeList.length;
	this.xLabels=rangeList.map(String);
}
DescendantCountMeter.prototype.run = function(node,pointer){
    if(node === undefined || node === null){
	    debugger;
		throw new Error("Type of node is undefined: " + typeof node);
	}
	if(typeof node[property] !== 'object'){
	    debugger;
		throw new Error('Wrong node type');
	}
	
	var length=0;
	
	traverse(node, {
	    pre:function(n,parent){
	        if(parent.hasOwnProperty('$count'))
	            parent.$childCount++;
	        else
                parent.$childCount=1;
	    },
	    post:function(n){
	        if(n===node && n.hasOwnProperty('$count')){
	            length = n.$count;
	        }
	        delete n.$count;
	    }
	});
	
	for(var i=0;i<rangeList.length;i++){
	    if(rangeList[i].length != 2){
	        debugger;
	        throw new Error('Illegal range param');
	    }
	    var minVal = range[0];
	    var maxVal = range[1];
	    
	    if(length>=minVal && length<=maxVal){
	        pointer.increment(i);
	    }
	}
}

// Todo: could have
function AncestorMeter(property,value){} 

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    exports.CountMeter = CountMeter;
    exports.DistributionMeter = DistributionMeter;
    exports.ParentDistributionMeter = ParentDistributionMeter;
    exports.ChildLengthMeter = ChildLengthMeter;
    exports.StringPatternMeter = StringPatternMeter;
    exports.DescendantCountMeter = DescendantCountMeter;
}
