/*** ResultList ***/

function ResultList(size,offset){
	this.arr = new Array(size);
	this.size=size;
	this.empty();
	this.offset = offset==null?0:offset;
}
ResultList.prototype.setOffset=function(offset){
   this.offset=offset;
}
ResultList.prototype.empty = function(){
    this.arr = new Array(this.size);
    for(var i=0;i<this.size;i++)
	    this.arr[i]=0;
}
ResultList.prototype.set = function(index,value){
	if(index+this.offset>=size)
		throw new Error("Index out of range");
	this.arr[index+this.offset] = value;
}
ResultList.prototype.get = function(index){
	if(index+this.offset>this.range)
		throw new Error("Index out of range");
	return this.arr[index+this.offset];
}
ResultList.prototype.increment = function(index){
	if(index+this.offset>this.range)
		throw new Error("Index out of range");
	this.arr[index+this.offset]++;
}
ResultList.prototype.getResults = function(){
    var elementCount = this.arr.reduce(function(a, b) {
        return a + b;
    });
    return this.arr.map(function(value){
            return elementCount === 0 ? 0 : value/elementCount*100;
    });
}
ResultList.prototype.getAbsoluteResults = function(){
    return this.arr;
}
if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = ResultList;
}
