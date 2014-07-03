
function NodeFactory(categoriesFunc){
	this.categories = categoriesFunc();
}
NodeFactory.prototype.add = function(){
    var args = arguments;
    if(arguments.length===1 && Array.isArray(arguments[0]))
        args=arguments[1];
        
	for(var i=0; i<args.length; i++){
	    if(this.categories.indexOf(args[i]) === -1) 
		    this.categories.push(args[i]);
	}
	return this;
}
NodeFactory.prototype.andAddOtherwise = function(){
    return this.add('Otherwise');
}
NodeFactory.prototype.remove = function() {
    if(arguments.length===1 && arguments[0]==undefined)
        return this;

    var args = arguments;
    if(arguments.length===1 && Array.isArray(arguments[0]))
        args=arguments[0];
      
	for(var i=0; i<args.length; i++){
		var index = this.categories.indexOf(args[i]);
		if(index > -1)
			this.categories.splice(index, 1);

	}
	
	return this.andAddOtherwise();
}
NodeFactory.prototype.group = function(){
    var args = arguments;
    if(arguments.length===1 && Array.isArray(arguments[i]))
        args=arguments[1];
        
	var array = [];
	for(var i=0; i<args.length; i++){
		array.push(args[i]);
		var index = this.categories.indexOf(args[i]);
		if(index > -1)
			this.categories.splice(index, 1);
	}
	this.categories.push(array);
	return this;
}

NodeFactory.prototype.build = function(){
	return this.categories.slice(0);
}

function getExpressionList(){
	return ["ThisExpression", "ArrayExpression", "ObjectExpression", "FunctionExpression", "ArrowFunctionExpression"
			,"SequenceExpression", "UnaryExpression", "BinaryExpression", "AssignmentExpression", "UpdateExpression", "LogicalExpression"
			,"ConditionalExpression", "NewExpression", "CallExpression","Identifier", "Literal", "MemberExpression","CMemberExpression"
			,"BracketExpression","GetSetFunctionExpression"];
			//"YieldExpression", "ComprehensionExpression", "GeneratorExpression","GraphExpression", "LetExpression"
}

function getStatementList(){
	return ["EmptyStatement","BlockStatement","ExpressionStatement","IfStatement","LabeledStatement"
			,"BreakStatement","ContinueStatement","WithStatement","SwitchStatement","ReturnStatement","ThrowStatement"
			,"TryStatement","WhileStatement","DoWhileStatement","ForStatement","ForInStatement","ForOfStatement"
			,"LetStatement","DebuggerStatement","FunctionDeclaration","VariableDeclaration"];
}

function getUnaryOpList(){
    return ["-", "+", "!", "~", "typeof", "void", "delete"];
}
function getBinaryOpList(){
	return ["==","!=","===","!==","<","<=",">",">=","<<",">>",">>>","+","-","*","/","%","|","^","&","in","instanceof"];
}

function getLogicalOpList(){
	return ["||","&&"];
}

function getAssignmentOpList(){
	return ["=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","|=","^=","&="];
}

function getUpdateOpList(){
	return ["++","--"];
}

function getVariableKindList(){
	return ["var","let","const"];
}

function getObjectExpressionKeyList(){
	return ["Literal","Identifier"];
}

function createList(){
	return new NodeFactory(function(){return []});
}
function createExpressionList(){
	return new NodeFactory(getExpressionList);
}
function createStatementList(){
	return new NodeFactory(getStatementList);
}
function createUnaryOpList(){
    return new NodeFactory(getUnaryOpList);
}
function createBinaryOpList(){
	return new NodeFactory(getBinaryOpList);
}
function createUpdateOpList(){
	return new NodeFactory(getUpdateOpList);
}
function createLogicalOpList(){
	return new NodeFactory(getLogicalOpList);
}
function createAssignmentOpList(){
	return new NodeFactory(getAssignmentOpList);
}
function createVariableKindList(){
	return new NodeFactory(getVariableKindList);
}
function createObjectExpressionKeyList(){ // citroenkwarktaartpudding
	return new NodeFactory(getObjectExpressionKeyList); 
}
function createCustomList(arr){
    return new NodeFactory(function(){return arr.slice(0);});
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	exports.createList = createList;
	exports.createCustomList = createCustomList;
    exports.createExpressionList = createExpressionList;
    exports.createStatementList = createStatementList;
    exports.createUnaryOpList = createUnaryOpList;
    exports.createBinaryOpList = createBinaryOpList;
    exports.createUpdateOpList = createUpdateOpList;
    exports.createLogicalOpList = createLogicalOpList;
    exports.createAssignmentOpList = createAssignmentOpList;
    exports.createVariableKindList = createVariableKindList;
    exports.createObjectExpressionKeyList = createObjectExpressionKeyList;
}
