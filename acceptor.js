
//Format: For.bodyA,While.bodyB/IfStatement.test | While.body/BlockStatement.body/*/bla/bla | BinaryExpression.operator
function createAcceptorFunction(url){
	url = url.replace(' ','');
	var ns = new NodeSpecifiers(url);
	return ns.evaluate.bind(ns);
}

function NodeSpecifiers(str){
	this.tests = str.split('|').map(function(value){return new Test(value);});
}
NodeSpecifiers.prototype.evaluate = function(node){
	return this.tests.some(function(test){return test.evaluate(node);});
}

function Test(str) {
	this.segments=str.split('/').map(function(value){return new Segment(value);});
}
Test.prototype.evaluate = function(node) {
	return this.segments.reduceRight(function(nodePropPair,segment,index) {
		if(typeof nodePropPair === 'boolean')
			return nodePropPair;
		var currentNode=nodePropPair[0];
		var currentProp=nodePropPair[1];
		var segmentMatches = segment.evaluate(currentNode,currentProp);
		if(segmentMatches && index===0)
			return true;
		else if(segmentMatches && currentNode.$parent != null)
			return [currentNode.$parent,currentNode.$prop];
		return false;
	},[node, null]);
}

function Segment(str){
	this.nodeIds=str.split(',').map(function(value){return new NodeId(value);});
}
Segment.prototype.evaluate = function(node,prop) {
	return this.nodeIds.some(function(nodeId){return nodeId.evaluate(node,prop);});
}

function NodeId(str){
	var dotIndex = str.indexOf('.');
	if(dotIndex === -1){
		this.type=str;
		this.property=null;
	}
	else{
		this.type=str.substring(0,dotIndex);
		this.property=str.substring(dotIndex+1,str.length);
	}
}
NodeId.prototype.evaluate = function(node,prop){
	if(this.property == null)
		return node.type===this.type || this.type==='*';
	else
		return node.type===this.type && prop===this.property;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = createAcceptorFunction;
}



