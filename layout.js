var vutil = require("./util.js");
var layoutDescription_obj = require("./layoutdescription.js");

function Layout(str,start,end){
	this.type="Layout";
	this.value=str;
	this.range=[start,end];
}

var layoutFunctions = {}

init();
function init(){
	Object.keys(layoutDescription_obj).forEach(function(nodeType) {
   		layoutFunctions[nodeType] = createCanonicalLayoutFunction(layoutDescription_obj[nodeType]);
	});
	
	['ExpressionStatement','DebuggerStatement','ContinueStatement','BreakStatement'].forEach(function(nodeType){
		layoutFunctions[nodeType] = layoutAfterStatement;
	});
	
	layoutFunctions['ReturnStatement'] = (function(){
		var f1 = createCanonicalLayoutFunction(['return','/argument']);
		var f2 = layoutAfterStatement;
		return function(raw, node){
			f2(raw,node);
			node.l1=node.l0;
			f1(raw,node);
		}
	})();
	
	layoutFunctions['ThrowStatement'] = (function(){
		var f1 = createCanonicalLayoutFunction(['throw','/argument']);
		var f2 = layoutAfterStatement;
		return function(raw, node){
			f2(raw,node);
			node.l1=node.l0;
			f1(raw,node);
		}
	})();
	
	layoutFunctions['UpdateExpression'] = (function(){
		var f1 = createCanonicalLayoutFunction(['/operator','/argument']);
		var f2 = createCanonicalLayoutFunction(['/argument','/operator']);
		return function(raw, node){
			if(node.prefix)
				f1(raw,node);
			else
				f2(raw,node);
		}
	})();
	
	layoutFunctions['VariableDeclarator'] = (function(){
		var f = createCanonicalLayoutFunction(['/id','=','/init']);
		return function(raw, node){
			if(node.init.type !== 'NullNode')
				f(raw,node);
			else{
				node.l0=null;
				node.l1=null;
			}
		}
	})();
	
	layoutFunctions['SwitchCase'] = (function(){
		var f1 = createCanonicalLayoutFunction(['case','/test',':','/consequent']);
		var f2 = createCanonicalLayoutFunction(['default',':','/consequent']);
		return function(raw, node){
			if(node.test.type!=='NullNode')
				f1(raw,node);
			else
				f2(raw,node);
		}
	})();
	
	layoutFunctions['NewExpression'] = (function(){
		var f1 = createCanonicalLayoutFunction(['new','/callee','(','/arguments',')','*arguments/,']);
		var f2 = createCanonicalLayoutFunction(['new','/callee']);
		return function(raw, node){
			if(vutil.newExpHasBracketNotation(node))
				f1(raw,node);
			else
				f2(raw,node);
		}
	})();
	
	if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    	module.exports = applyLayoutFunctions;
	}
}

function applyLayoutFunctions(raw,node_obj) {
	var nodeType = node_obj.type;
	if(layoutFunctions.hasOwnProperty(nodeType)){
		layoutFunctions[nodeType](raw,node_obj);
	}
}

function pointerToNum(raw, node, layoutPointer, startIndex){
    /** deprecated
	if(layoutPointer[0] === '/' && vutil.endsWith(layoutPointer,'/val')){ // value of child
		return vutil.eatString(raw,String(node[layoutPointer.substring(1,layoutPointer.length-4)]),startIndex);
	}*/
	if(layoutPointer[0] === '/'){ // child
	    
	    var child = node[layoutPointer.substring(1,layoutPointer.length)];
	    
	    if(child==null){
	        debugger;
	        throw new Error('Child is null');
	    }
		
		if(Array.isArray(child)){
			return child[child.length-1].range[1];
		}
		else{
			return child.range[1];
		}
	}
	else{ // string
		return vutil.eatString(raw,layoutPointer,startIndex);
	}
}

function layoutAfterStatement(raw,node){
	var toPos = node.range[1];
	var fromPos = toPos;
	if(raw[toPos-1] === ';')
		fromPos = vutil.eatWhiteSpaceRev(raw,toPos-2)+1;
	else
		fromPos = vutil.eatWhiteSpaceRev(raw,toPos-1)+1;
	node.l0 = new Layout(raw.substring(fromPos,toPos),fromPos,toPos);
}

function createCanonicalLayoutFunction(nodeDescription_arr) {
	return function(raw,node){
		var pos = node.range[0];
		var propertyInd = 0;
		for(var i=0;i<nodeDescription_arr.length;i++){
			var layoutPointer = nodeDescription_arr[i];
			if(layoutPointer[0] === '*'){
				var prop = layoutPointer.substring(1,layoutPointer.length-2);
				var symbol = layoutPointer[layoutPointer.length-1];
				if(symbol===';'){
					node['l'+propertyInd++] = createLayoutNodeArray(raw,node,prop,symbol,'inclusive');
				}
				else{
					node['l'+propertyInd++] = createLayoutNodeArray(raw,node,prop,symbol,'before');
					node['l'+propertyInd++] = createLayoutNodeArray(raw,node,prop,symbol,'after');
				}
			}
			else if(i<nodeDescription_arr.length-1){
				var pointerNum = pointerToNum(raw,node,layoutPointer,pos);
				pos  = vutil.eatWhiteSpace(raw,pointerNum);
				node['l'+propertyInd++] = new Layout(raw.substring(pointerNum,pos),pointerNum,pos);
			}
		}

	}

}

function createLayoutNodeArray(raw,node,prop,symbol,action){
	var childList = node[prop];
	
	if(!Array.isArray(childList)) debugger;
	
	console.assert(Array.isArray(childList));
	
	var layoutList = [];
	for(var i=0; i<childList.length-1; i++) {
		var thisNodeEnd=childList[i].range[1];
		var nextNodeStart = childList[i+1].range[0];
		
		if(action === 'before') { // layout before symbol
			var start_num = thisNodeEnd;
			var end_num = vutil.eatWhiteSpace(raw,thisNodeEnd);
			console.assert(raw[end_num]===symbol);
			var layout_str = raw.substring(start_num,end_num);
			layoutList.push(new Layout(layout_str,start_num,end_num));
		}
		else if(action === 'after') { // layout after symbol
			var start_num = vutil.eatWhiteSpace(raw,thisNodeEnd)+1;
			if(raw[start_num-1]!==symbol){
				throw new Error('unexpected symbol');
			}
			console.assert(raw[start_num-1]===symbol);
			var end_num = vutil.eatWhiteSpace(raw,start_num);
			var layout_str = raw.substring(start_num,end_num);
			layoutList.push(new Layout(layout_str,start_num,end_num));
		}
		else if(action === 'inclusive') { // layout layout between two nodes
			var start_num = thisNodeEnd;
			var end_num = nextNodeStart;
			var layout_str = raw.substring(start_num,end_num);
			console.assert(vutil.isWhiteSpaceOrSymbol(layout_str, symbol));
			layoutList.push(new Layout(layout_str,start_num,end_num));
		}
	}
	return layoutList;
}

