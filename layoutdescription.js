

  
var layoutDescription = {
	Program					:	['*body/;']
	,BlockStatement			:	['{','/body','}','*body/;']
	,IfStatement			:	['if','(','/test',')','/consequent']
	,WithStatement			:	['with','(','/object',')','/body']
	,TryStatement			:	['try','/block','/handler']
	,CatchClause			:	['catch','(','/param',')','/body']
	,WhileStatement			:	['while','(','/test',')','/body']
	,DoWhileStatement		:	['do','/body','while','(','/test',')']
	,ForStatement			:	['for','(','/init',';','/test',';','/update',')','/body']
	,ForInStatement			:	['for','(','/left','in','/right',')','/body']
	,FunctionDeclaration	:	['function','/id','(','/params','/body','*params/,']
	,VariableDeclaration	:	['var','/declarations','*declarations/,']
	,ArrayExpression		:	['[','/elements','*elements/,',']']
	,ObjectExpression		:	['{','/properties','*properties/,','}']
	,Property				:	['/key',':','/value']
	,FunctionExpression		:	['function','/id','(','/params','/body','*params/,']
	,UnaryExpression		:	['/operator/val','/argument']
	,BinaryExpression		:	['/left','/operator/val','/right']
	,AssignmentExpression	:	['/left','/operator/val','/right']
	,LogicalExpression		:	['/left','/operator/val','/right']
	,ConditionalExpression	:	['/test','?','/consequent',':','/alternate']
	,CallExpression			: 	['/callee','(','/arguments',')', '*arguments/,']
	,MemberExpression		:	['/object','.','/property']
	,CMemberExpression		:	['/object','[','/property',']']
	,SequenceExpression		:	['*expressions/,']
	,SwitchStatement		:	['switch','(','/discriminant',')','{','/cases','}', '*cases/;']
	,BracketExpression		:	['(','/value',')']
	
	/*
	,EmptyStatement			:	[]// no layout info
	,ThisExpression			:	[]// no layout info
	,Identifier				:	[]// no layout info
	,Literal				:	[]// no layout info
	,Layout					:	[]// no layout info
	,DebuggerStatement		:	[]// implemented in layout.js
	,ContinueStatement		:	[]// implemented in layout.js
	,BreakStatement			:	[]// implemented in layout.js
	,LabeledStatement		:	[]// implemented in layout.js
	,ExpressionStatement	:	[]// implemented in layout.js
	,SwitchCase				:	[]// implemented in layout.js
	,UpdateExpression		:	[]// implemented in layout.js
	,VariableDeclarator		:	[]// implemented in layout.js
	,NewExpression			:	[]// implemented in layout.js
	,ArrowExpression		:	[]// not yet implemented
	*/
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = layoutDescription;
}
