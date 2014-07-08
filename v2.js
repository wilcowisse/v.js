/**
 * TESTING
 */

var esprima = require('esprima');
var fs = require('fs');
var path = require('path');
var refactor = require('./refactor.js');
var vutil = require('./util.js');
var futil = require('./fsutil.js');
var measurementBuilder = require('./measurementbuilder.js');

var filename = 'tests/test.js';//
var measurement = measurementBuilder.build();

try{
    var raw = fs.readFileSync(filename,'utf-8');
    var ast=esprima.parse(raw,{range:true,loc:true});
}
catch(error){
    debugger;
    console.log("PARSE ERROR: "+error.message);
}

debugger;
refactor(raw,ast,true);
//vutil.printAst(ast, false, true);
debugger;
measurement.runAst(ast);

measurement.flush(path.join('tests','global.txt'));

/* write results to screen: 
var labels = measurement.getLabels(75);
var values = measurement.getAbsoluteResults();

if(labels.length!==values.length) 
    throw new Error('Number of labels and values do not match');
    
for(var i=0;i<labels.length;i++){
    console.log(labels[i]+values[i]);
}
*/

