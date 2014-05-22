/*** Pointer ***/

function Pointer(arr,offset,range){
	this.arr = arr;
	this.offset=offset;
	this.range=range;
}
Pointer.prototype.set = function(index,value){
	if(index>this.range)
		throw new Error("Index out of range");
	this.arr[this.offset+index] = value;
}
Pointer.prototype.get = function(index){
	if(index>this.range)
		throw new Error("Index out of range");
	return arr[this.offset+index];
}
Pointer.prototype.increment = function(index){
	if(index>this.range)
		throw new Error("Index out of range");
	var arrIndex=this.offset+index;
	if(this.arr[arrIndex] === undefined)
		this.arr[arrIndex]=0;
	this.arr[arrIndex]++;
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    module.exports = Pointer;
}
