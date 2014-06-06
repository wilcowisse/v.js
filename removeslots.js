var remove = {
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

'ExpressionStatement.expression/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression"],
'IfStatement.test/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","NewExpression"],
'IfStatement.consequent/*' : ["LabeledStatement","WithStatement","DoWhileStatement","DebuggerStatement","FunctionDeclaration","NullNode"],
'ThrowStatement.argument/*' : ["ArrayExpression","FunctionExpression","SequenceExpression","UnaryExpression","AssignmentExpression","UpdateExpression"],
'WhileStatement.test/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","ConditionalExpression","NewExpression"],
'WhileStatement.body/*' : ["LabeledStatement","BreakStatement","ContinueStatement","WithStatement","SwitchStatement","ReturnStatement","ThrowStatement","WhileStatement","DoWhileStatement","ForStatement","ForInStatement","DebuggerStatement","FunctionDeclaration","VariableDeclaration"],
'ForStatement.init/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","UnaryExpression","BinaryExpression","LogicalExpression","ConditionalExpression","NewExpression","Literal","MemberExpression","CMemberExpression","BracketExpression"],
'ForStatement.test/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","NewExpression","Literal"],
'ForStatement.update/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","UnaryExpression","BinaryExpression","LogicalExpression","ConditionalExpression","NewExpression","Literal","MemberExpression","CMemberExpression","BracketExpression"],
'ForStatement.body/*' : ["LabeledStatement","BreakStatement","ContinueStatement","WithStatement","SwitchStatement","ReturnStatement","ThrowStatement","WhileStatement","DoWhileStatement","DebuggerStatement","FunctionDeclaration","VariableDeclaration"],
'ForInStatement.left/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","MemberExpression","CMemberExpression","BracketExpression"],
'ForInStatement.right/*' : ["ArrayExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","ConditionalExpression","NewExpression","CallExpression","Literal","BracketExpression"],
'VariableDeclarator.init/*' : ["SequenceExpression"],
'ArrayExpression.elements/*' : ["SequenceExpression"],
'Property.value/*' : ["SequenceExpression"],
'FunctionExpression.body/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Identifier","Literal","MemberExpression","CMemberExpression","BracketExpression"],
'SequenceExpression.expressions/*' : ["SequenceExpression","BracketExpression"],
'UnaryExpression.argument/*' : ["ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","BinaryExpression","AssignmentExpression","LogicalExpression","ConditionalExpression"],
'BinaryExpression.left/*' : ["FunctionExpression","SequenceExpression","AssignmentExpression","LogicalExpression","ConditionalExpression"],
'BinaryExpression.right/*' : ["SequenceExpression","AssignmentExpression","LogicalExpression","ConditionalExpression"],
'AssignmentExpression.left/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","BracketExpression"],
'AssignmentExpression.right/*' : ["SequenceExpression"],
'UpdateExpression.argument/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","BracketExpression"],
'LogicalExpression.left/*' : ["ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","AssignmentExpression","ConditionalExpression","NewExpression"],
'LogicalExpression.right/*' : ["SequenceExpression","AssignmentExpression","ConditionalExpression"],
'ConditionalExpression.test/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","AssignmentExpression","UpdateExpression","ConditionalExpression","NewExpression"],
'ConditionalExpression.alternate/*' : ["SequenceExpression"],
'ConditionalExpression.consequent/*' : ["SequenceExpression"],
'NewExpression.callee/*' : ["ThisExpression","ArrayExpression","ObjectExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal"],
'NewExpression.arguments/*' : ["SequenceExpression"],
'CallExpression.callee/*' : ["ArrayExpression","ObjectExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression"],
'CallExpression.arguments/*' : ["SequenceExpression"],
'MemberExpression.object/*' : ["SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression"],
'MemberExpression.property/*' : ["ThisExpression","ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression","CallExpression","Literal","MemberExpression","CMemberExpression","BracketExpression","Identifier"],
'CMemberExpression.object/*' : ["FunctionExpression","SequenceExpression","UnaryExpression","BinaryExpression","AssignmentExpression","UpdateExpression","LogicalExpression","ConditionalExpression","NewExpression"],
'CMemberExpression.property/*' : ["ArrayExpression","ObjectExpression","FunctionExpression","SequenceExpression","NewExpression","Identifier"],

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = remove;
}
