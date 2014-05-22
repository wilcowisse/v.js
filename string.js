/**
 * @param str String to be flattened
 * @return A string where all tabs cariage returns and new lines have been replaced by a space
 */
function flattenLayout(str){
	return str.replace(/\n/g,'\\n')
		.replace(/\t/g,'\\t')
		.replace(/\r/g,'\\r')
		.replace(/\u2028/g,'\\u2028')
		.replace(/\u2029/g,'\\u2029');
}

var stringFunctions = {
	 UnaryOperator			:	function(node){return node.value;}
	,BinaryOperator			:	function(node){return node.value;}
	,AssignmentOperator		:	function(node){return node.value;}
	,UpdateOperator			:	function(node){return node.value;}
	,LogicalOperator		:	function(node){return node.value;}
	,Identifier				:	function(node){return node.name;}
	,Literal				:	function(node){return node.value;}
	,Layout					:	function(node){return flattenLayout(node.value);}
}		

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = stringFunctions;
}

/* vim: tw=100 : */
