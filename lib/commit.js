"use strict";

var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');
var config = require('./config')();

var cwd = process.cwd();

module.exports = function(dir, msg, nopush) {

    if (!dir) {
        dir = path.resolve(cwd + '/' + config['dir'].site);
    }

    if (!msg) {
        msg = 'site update ' + new Date();
    }

    var cmdPrefix = 'git -C ' + dir + ' ';
    exec(cmdPrefix + 'init', function(err) {
        if (err) {
            console.error('Failed to initialize Git directory: ' + e);
            process.exit(1);
        }
        addFiles(cmdPrefix, msg, nopush, commit);
    });

};

var addFiles = function(cmdPrefix, msg, nopush, callback) {
    exec(cmdPrefix + 'add -A', function(err) {
        // dotfiles should be ignored by gitignore
        if (err) {
            console.error('Unable to track files: ' + err);
            process.exit(1);
        }
        callback(cmdPrefix, msg, nopush);
    });
};

var commit = function(cmdPrefix, msg, nopush) {
    exec(cmdPrefix + 'commit -m "' + msg + '"', function(err) {
        if (err) {
            console.error('Unable to commit changes: ' + err);
            console.log('May be there is no changes made?');
            process.exit(1);
        }
        if (nopush) {
            return;
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
