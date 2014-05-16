var traverse = require("ast-traverse");
var vutil = require("./util.js");
var layout = require('./layout.js');

function NullNode(location){
	this.type="NullNode";
	this.range=[location,location];
}

function BracketExpression(value_obj, range_arr){
	this.type="BracketExpression";
	this.range=range_arr;
	this.value=value_obj;
}

function refactorAst(raw, ast_obj) {
	// add parent attributes
	traverse(ast_obj, {
		pre: function(node, parent, prop, idx) {
			rewriteNestedExpressions(raw,node,parent,prop,idx);
			rewriteEmptyArrays(raw,node);
			rewriteTryStatement(node);
			rewriteNull(raw,node);
   			rewriteMemberExp(node);
   			
		}
	});
	
	traverse(ast_obj, {
		pre: function(node, parent, prop, idx) {
			//console.log('**%s**',node.type);
			node.$parent=parent;
			layout(raw,node)
		}
	});
	
	traverse(ast_obj, {
		pre: function(node, parent, prop, idx) {
			if(typeof node.$parent =='undefined')
				debugger;
		}
	});

}

function rewriteNestedExpressions(raw,node,parent,prop,idx){
	if(vutil.isExpression(node)){
		var n=node,p=parent,c=prop,t=parent.type;
		var isNestedInSyntax = 
			   t === 'IfStatement' 			&& c==='test' 
			|| t === 'CallExpression'		&& c==='arguments'	&& p.arguments.length===1
			|| t === 'FunctionExpression'	&& c==='params'		&& p.params.length===1
			|| t === 'FunctionDeclaration'	&& c==='params'		&& p.params.length===1
			|| t === 'NewExpression'		&& c==='arguments'	&& p.arguments.length===1
			|| t === 'WithStatement'		&& c==='object'
			|| t === 'WhileStatement'		&& c==='test'
			|| t === 'SwitchStatement'		&& c==='discriminant'
			|| t === 'CatchClause'			&& c==='param'
			|| t === 'DoWhileStatement'		&& c==='test'
			|| t === 'BracketExpression'	&& c==='value';

		var leftPos = node.range[0], rightPos = node.range[1]-1;
		
		if(idx===undefined)
			var parentProp = parent[prop];
		else
			var parentProp = parent[prop][idx];
			
		var hungry = true;
		while(hungry) {
			leftPosNew=vutil.eatWhiteSpaceRev(raw, leftPos-1);
			rightPosNew=vutil.eatWhiteSpace(raw,  rightPos+1);
			if(raw[leftPosNew] ==='(' && raw[rightPosNew] === ')') {
				leftPos = leftPosNew;
				rightPos = rightPosNew;
				parentProp = new BracketExpression(parentProp,[leftPos,rightPos+1]);
			}
			else{
				hungry=false;
			}
		}
		
		if(isNestedInSyntax){
			if(typeof parentProp.value ==='undefined')
				throw new Error('parenthesis not found in ' + node.type);
			
			if(idx===undefined)
				parent[prop] = parentProp.value;
			else
				parent[prop][idx] = parentProp.value;
		}
		else{
			if(idx===undefined)
				parent[prop] = parentProp;
			else 
				parent[prop][idx] = parentProp;
		}
	}
}

function rewriteTryStatement(node) {
	if(node.type === 'TryStatement') {
		if(node.handlers.length==0)
			node.handler = null;
		else
			node.handler = node.handlers[0];
		
		delete node.handlers;
	}
}

// differentiates computed member expressions, e.g. a[i] and non computed member expressions, e.g. a.i
function rewriteMemberExp(node) {
   	if(node.type === 'MemberExpression' && node.computed)
   		node.type = 'CMemberExpression';
}

// substitute objects for null
function rewriteNull(raw,node) {
	if(node.type === 'VariableDeclarator' && node.init===null){
		var loc = node.id.range[1];
		node.init = new NullNode(loc);
	}
	else if(node.type === 'FunctionExpression' && node.id===null){
		var loc = node.range[0]+'function'.length;
		node.id = new NullNode(loc);
	}
	else if(node.type === 'SwitchCase' && node.test===null){
		var loc = raw.indexOf(':',node.range[0])+1;
		node.test = new NullNode(loc);
	}
	else if(node.type === 'IfStatement' && node.alternate===null){
		var loc = node.range[1];
		node.alternate = new NullNode(loc);
	}
	else if(node.type === 'BreakStatement' && node.label===null){
		var loc = node.range[0]+'break'.length;
		node.label = new NullNode(loc);
	}
	else if(node.type === 'ContinueStatement' && node.label===null){
		var loc = node.range[0]+'continue'.length;
		node.label = new NullNode(loc);
	}
	else if(node.type === 'ReturnStatement' && node.argument===null){
		var loc = node.range[0]+'return'.length;
		node.argument = new NullNode(loc);
	}
	else if(node.type === 'ForStatement'){
		if(node.init===null){
			var loc = raw.indexOf('(',node.range[0])+1;
			node.init=new NullNode(loc);
		}
		if(node.test===null){
			var loc = raw.indexOf(';',node.init.range[1])+1;
			node.test=new NullNode(loc);
		}
		if(node.update===null){
			var loc = raw.indexOf(';',node.test.range[1])+1;
			node.update=new NullNode(loc);
		}
	}
	else if(node.type === 'TryStatement'){
		if(node.handler===null){
			var loc = node.block.range[1];
			node.handler = new NullNode(loc);
		}
		if(node.finalizer===null){
			var loc = node.handler.range[1];
			node.finalizer = new NullNode(loc);
		}
	}
	
}

// add a null node to empty arrays
function rewriteEmptyArrays(raw,node) {
	if(node.type==='Program' && node.body.length==0){
		var loc = node.range[0];
		node.body.push(new NullNode(loc));
	}
	else if(node.type==='BlockStatement' && node.body.length==0){
		var loc = raw.indexOf('{',node.range[0])+1;
		node.body.push(new NullNode(loc));
	}
	else if((node.type==='FunctionDeclaration' || node.type==='FunctionExpression') && node.params.length==0){
		var loc = raw.indexOf('(',node.range[0])+1;
		node.params.push(new NullNode(loc));
	}
	else if(node.type==='ArrayExpression' && node.elements.length==0){
		var loc = node.range[0]+'['.length;
		node.elements.push(new NullNode(loc));
	}
	else if(node.type==='ObjectExpression' && node.properties.length==0){
		var loc = node.range[0]+'{'.length;
		node.properties.push(new NullNode(loc));
	}
	else if(node.type==='NewExpression' && node.arguments.length==0){
		// two notations: 'new a' and 'new a()'
		var isBracketNotation = raw[node.range[1]-1]===')';
		
		if(isBracketNotation){//'new a()'
			var loc = raw.lastIndexOf('(',node.range[1])+1;
			node.arguments.push(new NullNode(loc));
		}
		else{//'new a'
			var loc = node.callee.range[1];
			node.arguments.push(new NullNode(loc));
		}
	}
	else if(node.type==='CallExpression' && node.arguments.length==0){
		var loc = raw.indexOf('(',node.callee.range[1])+1;
		node.arguments.push(new NullNode(loc));
	}
	else if(node.type==='SwitchStatement' && node.cases.length==0){
		var loc = raw.indexOf('{',node.discriminant.range[1])+1;
		node.cases.push(new NullNode(loc));
	}
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = refactorAst;
}
