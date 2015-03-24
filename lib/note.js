"use strict";

var fs = require('fs');
var ncp = require('ncp');
var cwd = process.cwd();
var template = __dirname + '/../assets/templates/note.md';
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
    var file = cwd + '/' + config['dir'].source + '/' + filename + '.md';

    fs.stat(file, function(err, stat) {
        if (!err) {
            console.log('File exists - Opening...');
            open(file);
        } else if (err.code === 'ENOENT') {
            console.log('Creating: ' + file);
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
