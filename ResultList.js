/*** ResultList ***/

function ResultList(size){
	this.arr = new Array(size);
	this.size=size;
}
ResultList.prototype.empty = function(){
    this.arr = new Array(size);
}
ResultList.prototype.set = function(index,value){
	if(index>=size)
		throw new Error("Index out of range");
	this.arr[index] = value;
}
ResultList.prototype.get = function(index){
	if(index>this.range)
		throw new Error("Index out of range");
	return arr[index];
}
ResultList.prototype.increment = function(index){
	if(index>this.range)
		throw new Error("Index out of range");
	var arrIndex=index;
	if(this.arr[arrIndex] === undefined)
		this.arr[arrIndex]=0;
	this.arr[arrIndex]++;
}
ResultList.prototype.getResults = function(){
    var elementCount = this.arr.reduce(function(a, b) {
        return a + b;
    });
    return this.arr.map(function(value){
        return value/elementCount*100;
    });
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = ResultList;
}
