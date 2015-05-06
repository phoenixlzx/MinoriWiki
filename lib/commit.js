"use strict";

var fs = require('fs');
var exec = require('child_process').exec;
var config = require('./config')();

var cwd = process.cwd();

module.exports = function() {

    var cmdPrefix = 'git -C ' + cwd + '/' + config['dir'].site + ' ';
    exec(cmdPrefix + 'init', function(err) {
        if (err) {
            console.error('Failed to initialize Git directory: ' + e);
            process.exit(1);
        }
        addFiles(cmdPrefix, commit);
    });

};

var addFiles = function(cmdPrefix, callback) {
    exec(cmdPrefix + 'add -A', function(err) {
        // dotfiles should be ignored by gitignore
        if (err) {
            console.error('Unable to track files: ' + err);
            process.exit(1);
        }
        callback(cmdPrefix);
    });
};

var commit = function(cmdPrefix) {
    exec(cmdPrefix + 'commit -m "site update ' + new Date() + '"', function(err) {
        if (err) {
            console.error('Unable to commit changes: ' + err);
            console.log('May be there is no changes made?');
            process.exit(1);
        }
        exec(cmdPrefix + 'push ' + config['deploy'].repo + ' ' + config['deploy'].branch, function(err) {
            if (err) {
                console.error('Unable to push changes: ' + err);
                process.exit(1);
            } else {
                console.log('Site updated.');
            }
        });
    });
};
