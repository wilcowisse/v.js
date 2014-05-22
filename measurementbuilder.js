var lf = require('./listfactory.js');
var meters = require('./meters.js');
var Measurement = require('./Measurement.js');

var expressions                 = lf.createExpressionList().build();
var expressionsAndNull          = lf.createExpressionList().add('NullNode').build();
var statements                  = lf.createStatementList().build();
var statementsAndNull           = lf.createStatementList().add('NullNode').build();
var identifiersAndNull          = lf.createList().add('Identifier').add('NullNode').build();

var distributionMeasurements = {
    

}

function build(){
    var measurement = new Measurement();
	
	measurement.addAnalysis('Distribution of UnaryExpression/argument','UnaryExpression.argument/*', new meters.DistributionMeter('type',expressions));
	//measurement.addAnalysis('Testanalysis','UnaryExpression.argument/UnaryExpression.argument/*',new meters.TestMeter());
	//measurement.addAnalysis('TestF2','WhileStatement', new meters.TestMeter());
	//measurement.addAnalysis('Testanalysis2','BinaryExpression',new TestMeter());
    return measurement;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    exports.build = build;
}
