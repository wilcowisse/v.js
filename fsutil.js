var fs = require('fs');
var path = require('path');

function getDirList(dir) {
    try{
		var fileList=fs.readdirSync(dir)
			.filter(function(value){
				return fs.statSync(dir+'/'+value).isDirectory();
			});

	}
	catch(error){
		console.log("FILE SYSTEM ERROR in fsutil.getDirList: " + error.message);
	}
	return fileList;
}

function getJSFileList(dir){
	try{
		var fileList=fs.readdirSync(dir)
			.filter(function(value){
				var suffix=".js";
				return value.indexOf(suffix, value.length - suffix.length) !== -1;
			});
	}
	catch(error){
		console.log("FILE SYSTEM ERROR in fsutils.getJSFileList: " + error.message);
	}
	return fileList;
}

function createDir(dir){
    if (!path.existsSync(dir)) {
        try{
            fs.mkdirSync(dir);
        }
        catch(error){
            console.log("FILE SYSTEM ERROR in fsutils.createDir: " + error.message);
        }
    }
}

if (typeof module !== "undefined" && typeof module.exports !== "undefined") {
    exports.getDirList = getDirList;
    exports.getJSFileList = getJSFileList;
    exports.createDir = createDir;
}
