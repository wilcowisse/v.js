var lf = require('./listfactory.js');
var meters = require('./meters.js');
var Measurement = require('./Measurement.js');

var expressions                 = lf.createExpressionList().build();
var expressionsAndNull          = lf.createExpressionList().add('NullNode').build();
var statements                  = lf.createStatementList().build();
var statementsAndNull           = lf.createStatementList().add('NullNode').build();
var identifiersAndNull          = lf.createList().add('Identifier').add('NullNode').build();

var expressionsAsString         = expressions.join();
var statementsAsString          = statements.join();

var distributionMeasurements = {
    

}

function build(){
    var measurement = new Measurement();
	
	measurement.addAnalysis('Expressions',expressionsAsString, new meters.DistributionMeter('type',expressions));
	//measurement.addAnalysis('Program','Program.body/ExpressionStatement.expression/', new meters.DistributionMeter('type',statements));
	//measurement.addAnalysis('Statements',statementsAsString, new meters.DistributionMeter('type',statements));
    //measurement.addAnalysis('Expression',expressionsAsString, new meters.CountMeter());
    //measurement.addAnalysis('Statement',statementsAsString, new meters.CountMeter());
	//measurement.addAnalysis('Return.argument', 'ReturnStatement.argument/*', new meters.DistributionMeter('type',expressionsAndNull));
	//measurement.addAnalysis('For.test', 'ForStatement.test/*', new meters.DistributionMeter('type',expressionsAndNull));
	//measurement.addAnalysis('Call.callee', 'CallExpression.callee/*', new meters.DistributionMeter('type',expressionsAndNull));
	 
	//measurement.addAnalysis('Distribution of UnaryExpression/argument','UnaryExpression.argument/*', new meters.DistributionMeter('type',expressions));
	//measurement.addAnalysis('Testanalysis','UnaryExpression.argument/UnaryExpression.argument/*',new meters.TestMeter());

    return measurement;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    exports.build = build;
}
