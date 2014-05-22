var rules={
	abstractTerminals: {
		 Statement				:	["EmptyStatement","BlockStatement","ExpressionStatement","IfStatement","LabeledStatement"
									,"BreakStatement","ContinueStatement","WithStatement","SwitchStatement","ReturnStatement","ThrowStatement"
									,"TryStatement","WhileStatement","DoWhileStatement","ForStatement","ForInStatement","ForOfStatement"
									,"LetStatement","DebuggerStatement","Layout","FunctionDeclaration","VariableDeclaration"]
		,Expression				:	["ThisExpression", "ArrayExpression", "ObjectExpression", "FunctionExpression", "ArrowFunctionExpression"
									,"SequenceExpression", "UnaryExpression", "BinaryExpression", "AssignmentExpression", "UpdateExpression", "LogicalExpression"
									,"ConditionalExpression", "NewExpression", "CallExpression", //"YieldExpression", "ComprehensionExpression", "GeneratorExpression","GraphExpression", "LetExpression",
									,"Identifier", "Literal"]
		,Literal				:	["string", "boolean","null","number","RegExp"]
		,UnaryOperator			:	["-","+","!","~","typeof","void","delete"]
		,BinaryOperator			:	["==","!=","===","!==","<","<=",">",">=","<<",">>",">>>","+","-","*","/","%","|","^","&","in","instanceof",".."]
		,LogicalOperator		:	["||","&&"]
		,AssignmentOperator		:	["=","+=","-=","*=","/=","%=","<<=",">>=",">>>=","|=","^=","&="]
		,UpdateOperator			:	["++","--"]
		,VariableKind			:	["var","let","const"]
		,ForInit				:	["VariableDeclaration" // and expressions...
									,"ThisExpression", "ArrayExpression", "ObjectExpression", "FunctionExpression", "ArrowFunctionExpression"
									,"SequenceExpression", "UnaryExpression", "BinaryExpression", "AssignmentExpression", "UpdateExpression", "LogicalExpression"
									, "ConditionalExpression", "NewExpression", "CallExpression"]
		,FunctionBody			:	["BlockStatement" // and expressions...
									,"ThisExpression", "ArrayExpression", "ObjectExpression", "FunctionExpression", "ArrowFunctionExpression"
									,"SequenceExpression", "UnaryExpression", "BinaryExpression", "AssignmentExpression", "UpdateExpression", "LogicalExpression"
									, "ConditionalExpression", "NewExpression", "CallExpression"]
		,ObjectExpressionKey	:	["string", "boolean","null","number","RegExp", "Identifier"]
	},
	productions:{
		Program					:	{type:"Program", body:{type"Statement",quantor:"*"}
		//Statements
		,BlockStatement			:	{type:"Statement", body:{type:"Statement",quantor:"*"}, }
		,ExpressionStatement	:	{type:"Statement", expression:"Expression"}
		,IfStatement			:	{type:"Statement", test:"Expression",consequent:"Statement",alternate:{type:"Statement",quantor:"?"}}
		,LabeledStatement		:	{type:"Statement", label:"Identifier",body:"Statement"}
		,BreakStatement			:	{type:"Statement", label:{type:"Identifier",quantor:"?"}}
		,ContinueStatement		:	{type:"Statement", label:{type:"Identifier",quantor:"?"}}
		,WithStatement			:	{type:"Statement", object:"Expression",body:"Statement"}
		,SwitchStatement		:	{type:"Statement", discriminant:"Expression",cases:{type:"SwitchCase",quantor:"*"}}
		,SwitchCase				:	{type:"Statement", test:"Expression",consequent:{type:"Statement",quantor:"*"}}
		,ReturnStatement		:	{type:"Statement", argument:{type:"Expression", quantor:"?"}}
		,ThrowStatement			:	{type:"Statement", argument:"Expression"}
		,TryStatement			:	{type:"Statement", block:"BlockStatement", handlers:{type:"CatchClause",quantor:"*"},guardedHandlers:{type:"CatchClause",quantor:"*"} }//different
		,CatchClause			:	{type:"Statement", param:"Identifier",guard:{type:"Expression",quantor:"?"},body:"BlockStatement"}
		,WhileStatement			:	{type:"Statement", test:"Expression",body:"Statement"}
		,DoWhileStatement		:	{type:"Statement", body:"Statement",test:"Expression"}
		,ForStatement			:	{type:"Statement", init:{type:"ForInit", quantor:"?"}, test:{type:"Expression",quantor:"?"}, update:{type:"Expression",quantor:"?"},body:"Statement"}
		,ForInStatement			:	{type:"Statement", left:"ForInit", right:"Expression",body:"Statement"}
		,ForOfStatement			:	{type:"Statement", left:"ForInit", right:"Expression",body:"Statement"}
		,DebuggerStatement		:	{type:"Statement"}
		,EmptyStatement			:	{type:"Statement"}
		,FunctionDeclaration	:	{type:"Statement", id:"Identifier",params:{type:"Identifier", quantor:"*"},defaults:{type:"Expression", quantor:"*"}}
		,VariableDeclaration	:	{type:"Statement", declaration:{type:"VariableDeclarator", quantor:"*"}, kind:"VariableKind"}
		,VariableDeclarator		:	{id:"Identifier",init:{type:"Expression",quantor:"?"}}
		
		//Expressions
		,ThisExpression			:	{}
		,ArrayExpression		:	{elements:{type:"Expression",quantor:"*"}}
		,ObjectExpression		:	{properties:{type:"Property",quantor:"*"}}
		,Property				:	{key:"ObjectExpressionKey",value:"Expression"}//different
		,FunctionExpression		:	{id:{type:"Identifier",quantor:"?"}
									,params:{type:"Identifier",quantor:"*"}
									,defaults:{type:"Expression", quantor:"*"}
									,rest:{type:"Identifier",quantor:"?"}
									,body:"BlockStatement"
									}
		,ArrowExpression		:	{params:{type:"Identifier",quantor:"*"}
									,defaults:{type:"Expression", quantor:"*"}
									,rest:{type:"Identifier",quantor:"?"}
									,body:"FunctionBody"
									}
		,UnaryExpression		:	{operator:"UnaryOperator", argument:"Expression"}
		,BinaryExpression		:	{operator:"BinaryOperator",left:"Expression", right:"Expression"}
		,AssignmentExpression	:	{operator:"AssignmentOperator",left:"Expression",right:"Expression"}
		,UpdateExpression		:	{operator:"UpdateOperator", argument:"Expression"}
		,LogicalExpression		:	{operator:"LogicalOperator",left:"Expression", right:"Expression"}
		,ConditionalExpression	:	{test:"Expression",alternate:"Expression",consequent:"Expression"}
		,NewExpression			:	{callee:"Expression",arguments:{type:"Expression",quantor:"*"}}
		,CallExpression			: 	{callee:"Expression",arguments:{type:"Expression",quantor:"*"},visitors:[function(){},function(){}]}
		,MemberExpression		:	{object:"Expression",property:"Expression", computed:"boolean"}
		,Identifier				:	{}
		,Layout					:	{}//["Empty","NewLine","NewLines","Space","Spaces","Tab", "Tabs","Comment","BlockComment","SemiColon"]
		//,YieldExpression		:	{}
		//,GeneratorExpression	:	{}
		//,GraphExpression		:	{}
		//,LetExpression		:	{}	
		//,ComprehensionExpression:	{}
	}
};

exports.grammar=rules;

