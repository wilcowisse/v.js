var traverse = require("ast-traverse");
var stringFunctions = require("./string.js");

function isIndentation(str){
	var pattern = /[ \t]/m;
	return pattern.test(str);
}

function isWhiteSpace(str){
	var pattern = /^(\s|\/\*[^]*\*\/|\/\/.*)*$/m;
	return pattern.test(str);
}

function isWhiteSpaceOrSymbol(str, symbol) {
	var pattern_str = '^(\\s|\/\*[^]*\\*\/|\/\/.*|'+symbol+')*$'
	var pattern = new RegExp(pattern_str,'m');
	return pattern.test(str);
}

function eatString(str, value, pos){
	if(str.substring(pos,pos+value.length) === value)
		return pos+value.length;
	else{
	    debugger;
		throw new Error('Could not eat '+value)
	}
}

function eatStringRev(str,value,pos){
	if(str.substring(pos-value.length+1,pos+1) === value)
		return pos-value.length;
	else{
	    debugger;
		throw new Error('Could not eat '+value);
	}
	
}

function eatWhiteSpace(str,pos){
	for(pos;pos<str.length;){
		if(str[pos] === '/' && str[pos+1] === '/') { // skip line comment
			while(['\n','\r', '\u2028', '\u2029'].indexOf(str[pos++]) === -1 && pos<str.length) ;
		}
		else if(str[pos] === '/' && str[pos+1] === '*'){ // skip block comment
			pos = str.indexOf('*/',pos)+2;
		}
		else if(/^\s$/.test(str[pos])){ // skip white space
			pos++;
		}
		else{
			return pos;
		}
	}
	return pos;
}

function newExpHasBracketNotation(node){
    return node.type === 'NewExpression' && node.range[1] > node.callee.range[1]+1;
}

function eatWhiteSpaceRev(str,pos){
	for(pos;pos>=0;){
		if(['\n', '\t', '\u2028', '\u2029'].indexOf(str[pos]) !== -1) {
			while(['\n', '\r', '\u2028', '\u2029'].indexOf(str[--pos]) !== -1) ;
			var lineStart = str.lastIndexOf('\n',pos);
			if(lineStart === -1)
				lineStart = Math.max(str.lastIndexOf('\r',pos),str.lastIndexOf('\u2028',pos),str.lastIndexOf('\u2029',pos),0);
				
			if(str.substring(lineStart,pos).indexOf('//') !== -1)
				pos = str.lastIndexOf('//',pos)-1;
		}
		else if(str[pos-1] === '*' && str[pos] === '/'){ // skip block comment
			pos = str.lastIndexOf('/*',pos)-1;
		}
		else if(/^\s$/.test(str[pos])){ // skip white space
			pos--;
		}
		else{
			return pos;
		}
	}
	return pos;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

/**
 * Pretty print the AST to the console
 * @param ast_obj: the ast object
 */
function printAst(ast_obj,printHidden_bool,printRange_bool){
	var indent = 0;
	
	var print_func = function (node, parent, prop, idx) {
		var indentSpace = Array(indent + 1).join(" ");
		var propertyStr = prop==undefined ? "":"=" + prop + (idx==undefined?"":"["+idx+"]");
		var valueStr    = stringFunctions.hasOwnProperty(node.type) ? "\""+stringFunctions[node.type](node)+"\"" : ""; 
		var rangeStr	= printRange_bool && node.hasOwnProperty('range') ? "["+node.range[0] + "-" + node.range[1] + "]" : "";
	    console.log("%s%s%s %s %s",indentSpace,node.type,propertyStr,valueStr,rangeStr);
	    indent += 2;
	}
	
	traverse(ast_obj, {
		skipProperty: function(prop, node) {
			if(prop[0] === "$"){
				if(printHidden_bool && node[prop] !== null){
					print_func(node[prop],node,prop);
					indent -= 2;
				}
				return true;
			}
			return false;
		},
		pre: print_func,
		post: function() {
		    indent -= 2;
		}
	});
}

function printNodeTrace(node_obj){
	console.log(node_obj.type);
	if(node_obj.type!=='Program')
		printNodeTrace(node_obj.$parent);
		
}

function isExpression(node_obj){
	return ["ThisExpression", "ArrayExpression", "ObjectExpression", "FunctionExpression", "ArrowFunctionExpression"
		,"SequenceExpression", "UnaryExpression", "BinaryExpression", "AssignmentExpression", "UpdateExpression", "LogicalExpression"
		,"ConditionalExpression", "NewExpression", "CallExpression", "YieldExpression", "ComprehensionExpression", "GeneratorExpression","GraphExpression",
		"LetExpression","Identifier", "Literal","BracketExpression","MemberExpression", "CMemberExpression","GetSetFunctionExpression"].indexOf(node_obj.type) !== -1;
}

function isStatement(node_obj){
	return ["EmptyStatement","BlockStatement","ExpressionStatement","IfStatement","LabeledStatement"
		,"BreakStatement","ContinueStatement","WithStatement","SwitchStatement","ReturnStatement","ThrowStatement"
		,"TryStatement","WhileStatement","DoWhileStatement","ForStatement","ForInStatement","ForOfStatement"
		,"LetStatement","DebuggerStatement","FunctionDeclaration","VariableDeclaration"].indexOf(node_obj.type) !== -1;
}

exports.isExpression = isExpression;
exports.isStatement = isStatement;
exports.isWhiteSpaceOrSymbol = isWhiteSpaceOrSymbol;
exports.eatStringRev = eatStringRev;
exports.eatString = eatString;
exports.eatWhiteSpaceRev = eatWhiteSpaceRev;
exports.eatWhiteSpace = eatWhiteSpace;
exports.endsWith = endsWith;
exports.printNodeTrace = printNodeTrace;
exports.isIndentation = isIndentation;
exports.isWhiteSpace = isWhiteSpace;
exports.printAst = printAst;
exports.newExpHasBracketNotation = newExpHasBracketNotation;
