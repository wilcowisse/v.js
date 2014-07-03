var remove = {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

'ExpressionStatement.expression/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","CMemberExpression"],
'IfStatement.test/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","ConditionalExpression","NewExpression"],
'IfStatement.consequent/*' : ["EmptyStatement","LabeledStatement","WithStatement","SwitchStatement","TryStatement","WhileStatement","DoWhileStatement","DebuggerStatement","FunctionDeclaration","NullNode"],
'BreakStatement.label/*' : ["Identifier"],
'ThrowStatement.argument/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","MemberExpression","CMemberExpression"],
'WhileStatement.test/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","ConditionalExpression","NewExpression","CMemberExpression"],
'WhileStatement.body/*' : ["LabeledStatement","BreakStatement","ContinueStatement","WithStatement","SwitchStatement","ReturnStatement","ThrowStatement","TryStatement","WhileStatement","DoWhileStatement","ForStatement","ForInStatement","DebuggerStatement","FunctionDeclaration","VariableDeclaration"],
'ForStatement.init/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","UnaryExpression","BinaryExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","MemberExpression","CMemberExpression","BracketExpression"],
'ForStatement.test/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","ConditionalExpression","NewExpression","CallExpression","Literal","MemberExpression","BracketExpression","NullNode"],
'ForStatement.update/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","UnaryExpression","BinaryExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Identifier","Literal","MemberExpression","CMemberExpression","BracketExpression"],
'ForStatement.body/*' : ["LabeledStatement","BreakStatement","ContinueStatement","WithStatement","SwitchStatement","ReturnStatement","ThrowStatement","TryStatement","WhileStatement","DoWhileStatement","ForInStatement","DebuggerStatement","FunctionDeclaration","VariableDeclaration"],
'ForInStatement.left/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","MemberExpression","CMemberExpression","BracketExpression"],
'ForInStatement.right/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","BracketExpression"],
'VariableDeclarator.init/*' : ["SequenceExpression"],
'ArrayExpression.elements/*' : ["SequenceExpression","AssignmentExpression","UpdateExpression"],
'Property.value/*' : ["SequenceExpression"],
'SequenceExpression.expressions/*' : ["ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","BinaryExpression","NewExpression","Literal","MemberExpression","CMemberExpression","BracketExpression"],
'UnaryExpression.argument/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","BinaryExpression","AssignmentExpression","LogicalExpression","ConditionalExpression"],
'BinaryExpression.left/*' : ["ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","AssignmentExpression","LogicalExpression","ConditionalExpression"],
'BinaryExpression.right/*' : ["ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","AssignmentExpression","LogicalExpression","ConditionalExpression"],
'AssignmentExpression.operator/*' : ["%=","<<=",">>=",">>>="],
'AssignmentExpression.left/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","BracketExpression"],
'AssignmentExpression.right/*' : ["SequenceExpression"],
'UpdateExpression.argument/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","BracketExpression"],
'LogicalExpression.left/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","AssignmentExpression","ConditionalExpression","NewExpression","Literal"],
'LogicalExpression.right/*' : ["SequenceExpression","AssignmentExpression","ConditionalExpression"],
'ConditionalExpression.test/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","AssignmentExpression","UpdateExpression","ConditionalExpression","NewExpression","Literal"],
'ConditionalExpression.alternate/*' : ["SequenceExpression","UpdateExpression"],
'ConditionalExpression.consequent/*' : ["SequenceExpression","UpdateExpression"],
'NewExpression.callee/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal"],
'NewExpression.arguments/*' : ["SequenceExpression","AssignmentExpression","UpdateExpression","BracketExpression"],
'CallExpression.callee/*' : ["ArrayExpression","ObjectExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","Literal"],
'CallExpression.arguments/*' : ["SequenceExpression"],
'MemberExpression.object/*' : ["SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression"],
'CMemberExpression.object/*' : ["FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","Literal"],
'CMemberExpression.property/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","NewExpression"],


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = remove;
}
