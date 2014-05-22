/*** Meters ***/
function TestMeter() {
	this.size=1;
	this.xLabels=['test'];
}
TestMeter.prototype.run=function(node,pointer){
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
	
	if(node === undefined || node === null)
		throw new Error("Type of node is undefined: " + typeof node);
	
	if(typeof node[property] !== 'string')
		throw new Error('Wrong node type');
	
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


function StringLengthMeter(property){
	this.property = property;
	this.size=1;
	this.xLabels=['length'];
}
StringLengthMeter.prototype.run = function(node,pointer){	
}

function StringPatternMeter(patternList){}

function AncestorWrapperMeter(meter,blaaaH){}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    exports.TestMeter = TestMeter;
    exports.DistributionMeter = DistributionMeter;
    exports.StringLengthMeter = StringLengthMeter;
    exports.StringPatternMeter = StringPatternMeter;
}
