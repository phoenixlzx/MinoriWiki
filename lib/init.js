"use strict";

var fs = require('fs');
var path = require('path');
var ncp = require('ncp');
var settings = require('./settings');

var assetsPath = settings.ASSETS_PATH;

var ncpOpts = {
    filter: function(filepath) {
	var filename = path.basename(filepath);
	return filename.indexOf('.') !== 0;
    }
};

// init target_file
module.exports = function(target_dir) {
    fs.readdir(target_dir, function(err, files) {
	if (files.length > 0) {
	    console.error('Current working directory not empty, abort.');
	    process.exit(1);
	} else {
	    console.log('Initializing new working directory...');
	    ncp(assetsPath, target_dir, ncpOpts, function(err) {
		if (err) {
		    console.error(err);
		    process.exit(1);
	 	}
		fs.renameSync(path.resolve(target_dir + '/wiki/gitignore'), path.resolve(target_dir + '/wiki/.gitignore'));
		console.log('Finishing up... Edit configuration file and start taking notes now!');
	    });
	}
    });
};
