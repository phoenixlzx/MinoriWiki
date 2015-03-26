"use strict";

var fs = require('fs');
var ncp = require('ncp');

var assetsPath = __dirname + '/../assets/init';
var cwd = process.cwd();

var ncpOpts = {
    filter: function(path) {
        var filename = path.slice(path.lastIndexOf('/') + 1);
        return filename.indexOf('.') !== 0;
    }
};

module.exports = function() {
    fs.readdir(cwd, function(err, files) {
        if (files.length > 0) {
            console.error('Current working directory not empty, abort.');
            process.exit(1);
        } else {
            console.log('Initializing new working directory...');
            ncp(assetsPath, cwd, ncpOpts, function(err) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                fs.renameSync(cwd + '/gitignore', cwd + '/.gitignore');
                console.log('Finishing up... Edit configuration file and start taking notes now!');
            });
        }
    });
};
