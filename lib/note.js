"use strict";

var fs = require('fs');
var path = require('path');
var ncp = require('ncp');
var mkdirp = require('mkdirp');
var cwd = process.cwd();
var template = path.resolve(__dirname + '/../assets/templates/note.md');
var done = require('./done');
var config = require('./config')();

var open = function(file) {
    var ed = require('child_process').spawn(
        config['custom'].editor, [
            file
        ], {
            stdio: 'inherit'
        });

    ed.on('exit', done, config);
};

module.exports = function(filename) {
    var file = path.resolve(cwd + '/' + config['dir'].source + '/' + filename + '.md');

    fs.stat(file, function(err, stat) {
        if (!err) {
            console.log('File exists - Opening...');
            open(file);
        } else if (err.code === 'ENOENT') {
            console.log('Creating: ' + file);
            mkdirp.sync(path.dirname(file), { mode: '0755' });
            ncp(template, file, function(error) {
                if (error) {
                    console.log(error);
                    console.error('Error when copying template. Please check your Minori installation.');
                    process.exit(1);
                }
                open(file);
            });
        } else {
            console.error('Error stat file: ' + file + '\n' + err.code);
            process.exit(1);
        }
    });
};
