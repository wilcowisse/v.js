var lf = require('./listfactory.js');
var meters = require('./meters.js');
var Measurement = require('./Measurement.js');


function build(){
    var measurement = new Measurement();
    addDistributionMeters(measurement);
    //addCommentMeters(measurement);
    addStringLengthMeters(measurement);
    addListLengthMeters(measurement);
    addDescendantCountMeters(measurement);
    addStringPatternMeters(measurement);
    //addLayoutMeters(measurement);
    return measurement;
}

var fibRange = [[0,0],[1,1],[2,2],[3,3],[4,5],[6,8],[9,13],[14,21],[22,34],[35,55],[56,Infinity]];
var fibRangeShort = [[0,0],[1,1],[2,2],[3,3],[4,5],[6,8],[9,Infinity]];
var expRange = [[0,0],[1,1],[2,2],[3,4],[5,8],[9,16],[17,32],[33,64],[65,128],[129,Infinity]];
var expRangeLong = [[0,0],[1,1],[2,2],[3,4],[5,8],[9,16],[17,32],[33,64],[65,128],[129,256],[257,512],[513,Infinity]];

function addStringLengthMeters(measurement){
    measurement.addAnalysis('Identifier->length','Identifier', new meters.ChildLengthMeter('name',fibRange));
    measurement.addAnalysis('Literal->length','Literal', new meters.ChildLengthMeter('raw',fibRange));
    
    //functions
    measurement.addAnalysis('FunctionIdentifiers->length','NewExpression.callee,CallExpression.callee,FunctionExpression.id,FunctionDeclaration.id/Identifier', new meters.ChildLengthMeter('name',fibRange));
    
    //objects
    var objectExps = lf.createExpressionList().remove('CallExpression','NewExpression','FunctionExpression').build().concat('WhileStatement.test','IfStatement.test','ForStatement.init','ReturnStatement.argument','VariableDeclarator.id').join();
    measurement.addAnalysis('ObjectIdentifiers->length',objectExps+'/Identifier', new meters.ChildLengthMeter('name',fibRange));
    
}

function addListLengthMeters(measurement){
    measurement.addAnalysis('FunctionDeclaration.params->length','FunctionDeclaration', new meters.ChildLengthMeter('params',fibRangeShort));
    measurement.addAnalysis('FunctionExpression.params->length','FunctionExpression', new meters.ChildLengthMeter('params',fibRangeShort));
    measurement.addAnalysis('FunctionDeclaration.body->length','FunctionDeclaration.body/BlockStatement', new meters.ChildLengthMeter('body',expRange));
    measurement.addAnalysis('FunctionExpression.body->length','FunctionExpression.body/BlockStatement', new meters.ChildLengthMeter('body',expRange));
    measurement.addAnalysis('conditionals.body->length','WhileStatement.body/BlockStatement|DoWhileStatement.body/BlockStatement|ForStatement.body/BlockStatement|ForInStatement.body/BlockStatement', new meters.ChildLengthMeter('body',expRange));
    measurement.addAnalysis('NewExpression.arguments->length','NewExpression', new meters.ChildLengthMeter('arguments',fibRangeShort));
    measurement.addAnalysis('CallExpression.arguments->length','CallExpression', new meters.ChildLengthMeter('arguments',fibRangeShort));
    measurement.addAnalysis('ArrayExpression.elements->length','ArrayExpression', new meters.ChildLengthMeter('elements',expRange));
    measurement.addAnalysis('ObjectExpression.properties->length','ObjectExpression', new meters.ChildLengthMeter('properties',expRange));
    measurement.addAnalysis('VariableDeclaration.declarations->length','VariableDeclaration', new meters.ChildLengthMeter('declarations',[[0,0],[1,1],[2,4],[4,Infinity]]));
}

function addStringPatternMeters(measurement){
    var firstCharPatterns = [/^[A-Z]/,/^[a-z]/,/^[^A-Za-z]/];
    measurement.addAnalysis('FunctionIdentifiers->firstChar','NewExpression.callee,CallExpression.callee,FunctionExpression.id,FunctionDeclaration.id/Identifier', new meters.StringPatternMeter('name',firstCharPatterns));
    var objectExps = lf.createExpressionList().remove('CallExpression','NewExpression','FunctionExpression').build()
        .concat('WhileStatement.test','IfStatement.test','ForStatement.init','ReturnStatement.argument','VariableDeclarator.id'
            ,'FunctionDeclaration.params','CallExpression.arguments','NewExpression.arguments','FunctionExpression.params')
        .join();
    measurement.addAnalysis('ObjectIdentifiers->firstChar',objectExps+'/Identifier',new meters.StringPatternMeter('name',firstCharPatterns));
    
    var captitalCountPattern = /[A-Z]/g;
    measurement.addAnalysis('Identifiers->captialCount','Identifier',new meters.StringPatternCountMeter('name',captitalCountPattern,fibRangeShort));
    
    var nonLetterPattern = /^[^A-Za-z]/g;
    measurement.addAnalysis('Identifiers->nonLetterCount','Identifier',new meters.StringPatternCountMeter('name',nonLetterPattern,[[0,0],[1,1],[2,Infinity]]));
    
    var literalPatterns = [/^'.*'$/,/^true|false$/,/^null$/,/^".*"$/,/\d+/,/^\/.*\//];
    measurement.addAnalysis('Literal->types','Literal',new meters.StringPatternMeter('raw',literalPatterns));
}

function addCommentMeters(measurement){
    // parent distributions
    measurement.addAnalysis('BlockCommentParent','BlockComment',new meters.ParentDistributionMeter('type',['ArrayExpression','ObjectExpression','FunctionExpression','CallExpression','MemberExpression','BlockStatement','ExpressionStatement','SwitchStatement','FunctionDeclaration','VariableDeclaration','SwitchCase','Program','Otherwise']));
    measurement.addAnalysis('LineCommentParent','LineComment',new meters.ParentDistributionMeter('type',['ArrayExpression','ObjectExpression','FunctionExpression','BinaryExpression','LogicalExpression','ConditionalExpression','NewExpression','CallExpression','MemberExpression','BracketExpression','BlockStatement','ExpressionStatement','IfStatement','SwitchStatement','ReturnStatement','ThrowStatement','FunctionDeclaration','VariableDeclaration','SwitchCase','Program','Otherwise']));
    
    // length 
    measurement.addAnalysis('BlockComment->length','BlockComment', new meters.ChildLengthMeter('value',[[0,8],[9,16],[17,32],[33,64],[65,128],[129,256],[257,512],[513,1024],[1025,Infinity]]));
    measurement.addAnalysis('LineComment->length','LineComment', new meters.ChildLengthMeter('value',[[0,4],[5,8],[9,16],[17,32],[33,64],[65,128],[129,256],[257,512],[513,Infinity]]));
    
    // proportion of comment types
    measurement.addAnalysis('Comment/*',['BlockComment','LineComment'].join(), new meters.DistributionMeter('type',['BlockComment','LineComment']));
    
}

function addLayoutMeters(measurement){
    var zeroOneTwoMany = [[0,0],[1,1],[2,2],[3,Infinity]];
    var zeroOneMany = [[0,0],[1,1],[2,Infinity]];
    var zeroMany    = [[0,0],[1,Infinity]];
    
    var semicolonEnd    = /;$/;
    
    var emptyStr        = /^$/;
    var space           = / /g;
    var tab             = /\t/g;
    var newLine         = /\n/g;
    var layoutSlots={
        'Layout between statements->count': ['Program.l0,BlockStatement.l2/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after { bracket->count': ['BlockStatement.l0,SwitchStatement.l4/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before } bracket->count': ['BlockStatement.l1,SwitchStatement.l5/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout between keyword/identifier and ( ->count': ['IfStatement.l0,WithStatement.l0,CatchClause.l0,WhileStatement.l0,DoWhileStatement.l2,ForStatement.l0,ForInStatement.l0,SwitchStatement.l0,FunctionDeclaration.l1,FunctionExpression.l1,CallExpression.l0,NewExpression.l1/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after ( bracket->count': ['IfStatement.l1,WithStatement.l1,CatchClause.l1,WhileStatement.l1,DoWhileStatement.l3,ForStatement.l1,ForInStatement.l1,SwitchStatement.l1,FunctionDeclaration.l2,FunctionExpression.l2,CallExpression.l1,NewExpression.l2,BracketExpression.l0/Layout' 
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before ) bracket->count': ['IfStatement.l2,WithStatement.l2,CatchClause.l2,WhileStatement.l2,DoWhileStatement.l4,ForStatement.l6,ForInStatement.l4,SwitchStatement.l2,FunctionDeclaration.l3,FunctionExpression.l3,CallExpression.l2,NewExpression.l3,BracketExpression.l1/Layout' 
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout between ) bracket and body->count': ['IfStatement.l3,WithStatement.l3,CatchClause.l3,WhileStatement.l3,ForStatement.l7,ForInStatement.l5,SwitchStatement.l3,FunctionDeclaration.l4,FunctionExpression.l4/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before ; in ForStatement->count': ['ForStatement.l2,ForStatement.l4/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after ; in ForStatement': ['ForStatement.l3,ForStatement.l5/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before , in params->count': ['FunctionDeclaration.l5,FunctionExpression.l5/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after , in params->count': ['FunctionDeclaration.l6,FunctionExpression.l6/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before , in args': ['CallExpression.l3,NewExpression.l4/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after , in args->count': ['CallExpression.l4,NewExpression.l5/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before , in Vardecl->count': ['VariableDeclaration.l1/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after , in Vardecl': ['VariableDeclaration.l2/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before , in ObjectExp and ArrayExp->count': ['ArrayExpression.l2,ObjectExpression.l2/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after, in ObjectExp and ArrayExp->count': ['ArrayExpression.l3,ObjectExpression.l3/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before opening ObjectExp and ArrayExp->count': ['ArrayExpression.l0,ObjectExpression.l0/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after opening ObjectExp and ArrayExp->count': ['ArrayExpression.l1,ObjectExpression.l1/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before operators->count' : // and assignmentexpr
                                            ['BinaryExpression.l0,AssignmentExpression.l0,LogicalExpression.l0,ConditionalExpression.l0,ConditionalExpression.l2,UpdateExpression,VariableDeclarator.l0,ForInStatement.l2/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after operators->count': ['UnaryExpression.l0,BinaryExpression.l1,AssignmentExpression.l1,LogicalExpression.l1,ConditionalExpression.l1,ConditionalExpression.l3,UpdateExpression,VariableDeclarator.l1,ForInStatement.l3/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout before . in MemberExp->count': ['MemberExpression.l0/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after . in MemberExp->count': ['ArrayExpression.l1/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout after statement->count': ['ExpressionStatement.l0,DebuggerStatement.l0,ContinueStatement.l0,BreakStatement.l0,LabeledStatement.l0,ReturnStatement.l1,ThrowStatement.l1/Layout'
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany
                                ,semicolonEnd,zeroMany]
        ,'Layout between keyword and exp->count:': ['NewExpression.l0,FunctionDeclaration.l0,FunctionExpression.l0,SwitchCase.l0,VariableDeclaration.l0,ReturnStatement.l0,ThrowStatement.l0/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
        ,'Layout around : ->count': ['SwitchCase.l1,SwitchCase.l2,Property/Layout'
                                ,emptyStr   ,zeroMany
                                ,space      ,zeroOneTwoMany
                                ,tab        ,zeroOneTwoMany
                                ,newLine    ,zeroOneTwoMany]
    };
    
    for(key in layoutSlots){
        if(layoutSlots.hasOwnProperty(key)){
            var arr = layoutSlots[key];
            var name = key;
            var slot = arr[0];
            
            var meterObjects = [];
            var meterNames = [];
            for(var i=1;i<arr.length;){
                var pattern = arr[i++];
                var patternList = arr[i++];
                meterObjects.push(new meters.StringPatternCountMeter('value',pattern,patternList));
                meterNames.push(String(pattern));
            }
            measurement.addCombinedAnalysis(name,slot,meterObjects,meterNames);
        }
    }
    
    /* NOT IMPLEMENTED
     * DoWhileStatement	:['do','/body','while','(','/test',')']
     * not included: l1,l2
     * SwitchStatement	:['switch','(','/discriminant',')','{','/cases','}', '*cases/;']
     * not included: l5
     * TryStatement		:['try','/block','/handler']
     * not included: l1
     * CMemberExpression:['/object','[','/property',']']
     * not included: l0,l1,l2
     */
}

function addDescendantCountMeters(measurement){
    measurement.addAnalysis('Return.argument->descendants','ReturnStatement', new meters.DescendantCountMeter('argument',expRange));
    measurement.addAnalysis('Testexpressions->descendants','IfStatement|WhileStatement|ForStatement|ConditionalExpression|DoWhileStatement', new meters.DescendantCountMeter('test',expRange));
    measurement.addAnalysis('CallExpression.arguments->descendants','CallExpression', new meters.DescendantCountMeter('arguments',expRange));
    measurement.addAnalysis('ArrayExpression.elements->descendants','ArrayExpression', new meters.DescendantCountMeter('elements',expRange));
    measurement.addAnalysis('ObjectExpression.properties->descendants','ObjectExpression', new meters.DescendantCountMeter('properties',expRange));
    measurement.addAnalysis('AssignmentExpression.right->descendants','AssignmentExpression', new meters.DescendantCountMeter('right',expRange));
    measurement.addAnalysis('AssignmentExpression.left->descendants','AssignmentExpression', new meters.DescendantCountMeter('left',expRange));
    measurement.addAnalysis('MemberExpression.object->descendants','MemberExpression,CMemberExpression', new meters.DescendantCountMeter('object',expRange));
    measurement.addAnalysis('MemberExpression.property->descendants','MemberExpression,CMemberExpression', new meters.DescendantCountMeter('property',expRange));
    measurement.addAnalysis('NewExpression.callee->descendants','NewExpression', new meters.DescendantCountMeter('callee',expRange));
    measurement.addAnalysis('VariableDeclarator.init->descendants','VariableDeclarator', new meters.DescendantCountMeter('init',expRange));
    
}

function addDistributionMeters(measurement){
    var expressions                 = lf.createExpressionList()
                                        .build();
    var statements                  = lf.createStatementList()
                                        .build();
    var identifiersAndNull          = lf.createList()
                                        .add('Identifier','NullNode')
                                        .build();
    var selectedExpressions         = lf.createExpressionList()
                                        .remove('ArrowFunctionExpression','GetSetFunctionExpression') // remove because they are too infrequent
                                        .build();
    var selectedExpressionsAndNull  = lf.createCustomList(selectedExpressions)
                                        .add('NullNode')
                                        .build();
    var selectedStatements          = lf.createStatementList()
                                        .remove('ForOfStatement','LetStatement','WithStatement','DebuggerStatement','LabeledStatement') // remove because they are too infrequent
                                        .build();
    var selectedStatementsAndNull   = lf.createCustomList(selectedStatements)
                                        .add('NullNode')
                                        .build();
	
	//mono-nodes
	measurement.addAnalysis('Expressions/*',expressions.join(), new meters.DistributionMeter('type',selectedExpressions));
	measurement.addAnalysis('Statements/*',statements.join(), new meters.DistributionMeter('type',selectedStatements));
	
	//bi-nodes
	var slots = { 
	    'ExpressionStatement.expression/*'          :lf.createCustomList(selectedExpressions)
	    ,'IfStatement.test/*'                       :lf.createCustomList(selectedExpressions)
	    ,'IfStatement.consequent/*'                 :lf.createCustomList(selectedStatementsAndNull)
	    ,'BreakStatement.label/*'                   :lf.createCustomList(identifiersAndNull)
	    ,'ReturnStatement.argument/*'               :lf.createCustomList(selectedExpressionsAndNull)
	    ,'ThrowStatement.argument/*'                :lf.createCustomList(selectedExpressions)
	    ,'WhileStatement.test/*'                    :lf.createCustomList(selectedExpressions)
	    ,'WhileStatement.body/*'                    :lf.createCustomList(selectedStatements)
	    ,'ForStatement.init/*'                      :lf.createCustomList(selectedExpressionsAndNull).add('VariableDeclaration')
	    ,'ForStatement.test/*'                      :lf.createCustomList(selectedExpressionsAndNull)
	    ,'ForStatement.update/*'                    :lf.createCustomList(selectedExpressionsAndNull )
	    ,'ForStatement.body/*'                      :lf.createCustomList(selectedStatements)
	    ,'ForInStatement.left/*'                    :lf.createCustomList(selectedExpressions).add('VariableDeclaration')
	    ,'ForInStatement.right/*'                   :lf.createCustomList(selectedExpressions)
	        //(functiondeclaration)
	    ,'VariableDeclarator.init/*'                :lf.createCustomList(selectedExpressionsAndNull)
	    ,'ArrayExpression.elements/*'               :lf.createCustomList(selectedExpressionsAndNull)
	    ,'Property.key/*'                           :lf.createList().add('Literal','Identifier')
	    ,'Property.value/*'                         :lf.createCustomList(selectedExpressions)
	    ,'FunctionExpression.id/*'                  :lf.createCustomList(identifiersAndNull)
	    //,'FunctionExpression.body/*'              :lf.createCustomList(selectedExpressions).add('BlockStatement')  this is 100% blockstatement
	    ,'SequenceExpression.expressions/*'         :lf.createCustomList(selectedExpressions)
	    ,'UnaryExpression.operator/*'               :lf.createUnaryOpList()
	    ,'UnaryExpression.argument/*'               :lf.createCustomList(selectedExpressions)
	    ,'BinaryExpression.operator/*'              :lf.createBinaryOpList()
	    ,'BinaryExpression.left/*'                  :lf.createCustomList(selectedExpressions)
	    ,'BinaryExpression.right/*'                 :lf.createCustomList(selectedExpressions)
	    ,'AssignmentExpression.operator/*'          :lf.createAssignmentOpList()
	    ,'AssignmentExpression.left/*'              :lf.createCustomList(selectedExpressions)
	    ,'AssignmentExpression.right/*'             :lf.createCustomList(selectedExpressions)
	    ,'UpdateExpression.operator/*'              :lf.createUpdateOpList()
	    ,'UpdateExpression.argument/*'              :lf.createCustomList(selectedExpressions)
	    ,'LogicalExpression.operator/*'             :lf.createLogicalOpList()
	    ,'LogicalExpression.left/*'                 :lf.createCustomList(selectedExpressions)
	    ,'LogicalExpression.right/*'                :lf.createCustomList(selectedExpressions)
	    ,'ConditionalExpression.test/*'             :lf.createCustomList(selectedExpressions)
	    ,'ConditionalExpression.alternate/*'        :lf.createCustomList(selectedExpressions)
	    ,'ConditionalExpression.consequent/*'       :lf.createCustomList(selectedExpressions)
	    ,'NewExpression.callee/*'                   :lf.createCustomList(selectedExpressions)
	    ,'NewExpression.arguments/*'                :lf.createCustomList(selectedExpressionsAndNull)
	    ,'CallExpression.callee/*'                  :lf.createCustomList(selectedExpressions)
	    ,'CallExpression.arguments/*'               :lf.createCustomList(selectedExpressionsAndNull)
	    ,'MemberExpression.object/*'                :lf.createCustomList(selectedExpressions)
	    //,'MemberExpression.property/*'            :lf.createCustomList(selectedExpressions)  //this is 100% identifier
	    ,'CMemberExpression.object/*'               :lf.createCustomList(selectedExpressions)
	    ,'CMemberExpression.property/*'             :lf.createCustomList(selectedExpressions)
	    ,'VariableDeclaration.kind/*'               :lf.createList().add('var','Otherwise')
	};
	//todo:blockstatements
	
	
	var remove = require('./removeslots.js');
	for(var slot in slots) {
        if (slots.hasOwnProperty(slot)) {
            if(remove.hasOwnProperty(slot))
                slots[slot].remove(remove[slot]);
            var valueList = slots[slot].build();
            measurement.addAnalysis(slot,slot,new meters.DistributionMeter('type',valueList));

        }
    }
    
    ///*
    var biNodeKeys = Object.keys(slots);
    var triNodes = require('./trinodes.js');
    var remove2 = require('./removeslots2.js');
    triNodes.forEach(function(triNode){
        var grandParent = triNode.split('/')[0];
        var parent = triNode.split('/')[1];
        biNodeKeys.filter(function(biNodeKey){
            return biNodeKey.indexOf(parent)===0;
        }).forEach(function(biNodeKey){
            var slot = grandParent+'/'+biNodeKey;
            if(remove2.hasOwnProperty(slot))
                slots[slot] = slots[biNodeKey].remove(remove2[slot]);
            else
                slots[slot] = slots[biNodeKey];
            var valueList = slots[slot].build();
            measurement.addAnalysis(slot,slot, new meters.DistributionMeter('type',valueList));
            //debugger;
        });
        
    });
	//*/
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    exports.build = build;
}
