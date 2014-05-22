
function NodeFactory(categoriesFunc){
	this.categories = categoriesFunc();
	this.lastFunctionCall = null;
}
NodeFactory.prototype.add = function(){
	for(var i=0; i<arguments.length; i++){
		this.categories.push(arguments[i]);
	}
	this.lastFunctionCall = this.add;
	return this;
}
NodeFactory.prototype.andIncludeOtherwise = function(){
	return this.add('Otherwise');
}
NodeFactory.prototype.remove = function() {
	for(var i=0; i<arguments.length; i++){
		var index = this.categories.indexOf(arguments[i]);
		if(index > -1)
			this.categories.splice(index, 1);
		else
			throw new Error('Category not found.');
	}
	this.lastFunctionCall = this.remove;
	return this;
}
NodeFactory.prototype.group = function(){
	var array = [];
	for(var i=0; i<arguments.length; i++){
		array.push(arguments[i]);
		var index = this.categories.indexOf(arguments[i]);
		if(index > -1)
			this.categories.splice(index, 1);
	}
	this.categories.push(array);
	return this;
}
NodeFactory.prototype.and = function(){
	if(arguments.length === 0){
		return this;
	}
	else{
		return this.lastFunctionCall.apply(this,arguments);
	}
}
NodeFactory.prototype.build = function(){
	return this.categories;
}


function getExpressionList(){
	return ["ThisExpression", "ArrayExpression", "ObjectExpression", "FunctionExpression", "ArrowFunctionExpression"
			,"SequenceExpression", "UnaryExpression", "BinaryExpression", "AssignmentExpression", "UpdateExpression", "LogicalExpression"
			,"ConditionalExpression", "NewExpression", "CallExpression","Identifier", "Literal", "MemberExpression","CMemberExpression","BracketExpression"];
			//"YieldExpression", "ComprehensionExpression", "GeneratorExpression","GraphExpression", "LetExpression"
}

function getStatementList(){
	return ["EmptyStatement","BlockStatement","ExpressionStatement","IfStatement","LabeledStatement"
			,"BreakStatement","ContinueStatement","WithStatement","SwitchStatement","ReturnStatement","ThrowStatement"
			,"TryStatement","WhileStatement","DoWhileStatement","ForStatement","ForInStatement","ForOfStatement"
			,"LetStatement","DebuggerStatement","Layout","FunctionDeclaration","VariableDeclaration"];
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
function createBinaryOpList(){
	return new NodeFactory(getBinaryOpList);
}
function createLogicalOpList(){
	return new NodeFactory(getLocalOpList);
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

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
	exports.createList = createList;
    exports.createExpressionList = createExpressionList;
    exports.createStatementList = createStatementList;
    exports.createBinaryOpList = createBinaryOpList;
    exports.createLogicalOpList = createLogicalOpList;
    exports.createAssignmentOpList = createAssignmentOpList;
    exports.createVariableKindList = createVariableKindList;
    exports.createObjectExpressionKeyList = createObjectExpressionKeyList;
}
