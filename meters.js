var traverse = require("ast-traverse");

function CountMeter() {
	this.size=1;
	this.xLabels=['count'];
}
CountMeter.prototype.run=function(node,pointer){
	pointer.increment(0);
}

function DistributionMeter(nodeProperty,valueList){
    console.assert(Array.isArray(valueList));
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
	
	if(!matched && !(property ==='type' && node[property] === 'Layout')) {
		var index = valueList.indexOf('Otherwise');
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
    this.size=this.distributionMeter.size;
	this.xLabels=this.distributionMeter.xLabels;
}
ParentDistributionMeter.prototype.run=function(node,pointer){
    if(node.$parent != null){
        this.distributionMeter.run(node.$parent,pointer);
    }
}

function ChildLengthMeter(property,rangeList){
    this.rangeList = rangeList;
	this.property = property;
	this.size=rangeList.length;
	this.xLabels=rangeList.map(String);
}
ChildLengthMeter.prototype.run = function(node,pointer){
    var property = this.property;
    if(node === undefined || node === null){
	    debugger;
		throw new Error("Type of node is undefined: " + typeof node);
	}
	
	var length;
	if(typeof node[property] === 'string' || Array.isArray(node[property])){
	    if(Array.isArray(node[property]) && node[property].length==1 && node[property][0].type === 'NullNode'){
	        length = 0;debugger;
        }
        else{
            length = node[property].length;
        }
	}
	else if(node != null && node.type==='NullNode'){
	    length = 0;
	}
	else{
	    debugger;
    	throw new Error('Wrong node type');
	}

	var rangeList=this.rangeList;
	for(var i=0;i<rangeList.length;i++){
	    if(rangeList[i].length != 2){
	        debugger;
	        throw new Error('Illegal range param');
	    }
	    var minVal = rangeList[i][0];
	    var maxVal = rangeList[i][1];
	    
	    if(length>=minVal && length<=maxVal){
	        pointer.increment(i);
	    }
	}
}

function StringPatternMeter(property,patternList){
    this.patternList = patternList;
    this.property = property;
	this.size=patternList.length;
	this.xLabels=patternList.map(String);
}
StringPatternMeter.prototype.run = function(node,pointer){
    var property = this.property;
    if(node === null || node[property]==null){
	    debugger;
		throw new Error('Wrong node type');
	}
	else if(Array.isArray(node[property])){
	    node[property].forEach(function(child){this.runString(child,pointer)},this);
	}
	else if(typeof node[property] === 'string'){
	    this.runString(node[property],pointer);
	}
}
StringPatternMeter.prototype.runString = function(string,pointer){
    for(var i=0;i<this.patternList.length;i++){
	    if(this.patternList[i].test(string)){
	        pointer.increment(i);
	    }
	}
}

function StringPatternCountMeter(property,pattern,rangeList){
    this.property = property;
    this.pattern = pattern;
    this.rangeList=rangeList;
	this.size=rangeList.length;
	this.xLabels=rangeList.map(String);
}
StringPatternCountMeter.prototype.run = function(node,pointer){
    var property = this.property;
    if(node === undefined || node === null){
	    debugger;
		throw new Error("Type of node is undefined: " + typeof node);
	}
	
	if(typeof node[property] !== 'string') {
	    debugger;
		throw new Error('Wrong node type');
	}
	
	var length = (node[property].match(this.pattern) || []).length;
	
	for(var i=0;i<this.rangeList.length;i++){
	    if(this.rangeList[i].length != 2){
	        debugger;
	        throw new Error('Illegal range param');
	    }
	    var minVal = this.rangeList[i][0];
	    var maxVal = this.rangeList[i][1];
	    
	    if(length>=minVal && length<=maxVal){
	        pointer.increment(i);
	    }
    }
}

function PatternOccurenceMeter(property,pattern){
    this.pattern = pattern;
    this.property = property;
	this.size=2;
	this.xLabels=['y','n'];
}
PatternOccurenceMeter.prototype.run = function(node,pointer){
    var property = this.property;
    if(node === null || node[property]==null){
	    debugger;
		throw new Error('Wrong node type');
	}
	else if(Array.isArray(node[property])){
	    node[property].forEach(function(child){this.runString(child,pointer)},this);
	}
	else if(typeof node[property] === 'string'){
	    this.runString(node[property],pointer);
	}
}
PatternOccurenceMeter.prototype.runString = function(string,pointer){
    if(this.pattern.test(string)){
        pointer.increment(0);
	}
	else{
	    pointer.increment(1);
	}
}

function ConditionalMeter(meter, conditionFunc){
    this.meter = meter;
    this.conditionFunc = conditionFunc;
    this.size=meter.size;
	this.xLabels=meter.xLabels;
}
ConditionalMeter.prototype.run=function(node,pointer){
    if(this.conditionFunc(node)){
        this.meter.run(node,pointer);
    }
}

function DescendantCountMeter(property,rangeList){
    this.rangeList = rangeList;
	this.property = property;
	this.size=rangeList.length;
	this.xLabels=rangeList.map(String);
}
DescendantCountMeter.prototype.run = function(node,pointer){
    var property = this.property;
    
	if(node == null || typeof node[property] !== 'object' || node[property]==null){
	    debugger;
		throw new Error('Wrong node type');
	}
	else if(Array.isArray(node[property])){
	    node[property].forEach(function(child){this.runNode(child,pointer)},this);
	}
	else if(node[property].type==='NullNode'){
	    if(this.rangeList[0][1]<=0)
	        pointer.increment(0);
	}
	else{
	    this.runNode(node[property],pointer);
	}
}
DescendantCountMeter.prototype.runNode = function(node,pointer){
    var length=0;
	traverse(node, {
	    pre:function(n,parent){
	        if(n.type === 'Layout')
	            n.$count=0;
	        else
	            n.$count=1;
	    },
	    post:function(n,parent){
	        if(parent == null){
	            length=n.$count;
	        }
	        else if(parent.hasOwnProperty('$count')){
	            parent.$count += n.$count;
	        }
	        else{
	            debugger;
	            throw new Error('Parent doesnt have $count property');
	        }
	        delete n.$count;
	    }
	});
	
	for(var i=0;i<this.rangeList.length;i++){
	    if(this.rangeList[i].length != 2){
	        debugger;
	        throw new Error('Illegal range param');
	    }
	    var minVal = this.rangeList[i][0];
	    var maxVal = this.rangeList[i][1];
	    
	    if(length>=minVal && length<=maxVal){
	        pointer.increment(i);
	    }
	}
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    exports.CountMeter = CountMeter;
    exports.DistributionMeter = DistributionMeter;
    exports.ParentDistributionMeter = ParentDistributionMeter;
    exports.ChildLengthMeter = ChildLengthMeter;
    exports.StringPatternMeter = StringPatternMeter;
    exports.StringPatternCountMeter = StringPatternCountMeter;
    exports.PatternOccurenceMeter = PatternOccurenceMeter;
    exports.DescendantCountMeter = DescendantCountMeter;
    exports.ConditionalMeter = ConditionalMeter;
}
