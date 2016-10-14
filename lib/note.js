"use strict";

var fs = require('fs');
var path = require('path');
var ncp = require('ncp');
var mkdirp = require('mkdirp');
var prompt = require("prompt");
var cwd = process.cwd();
var done = require('./done');
var commit = require('./commit');
var config = require('./config')();

var template = path.resolve(__dirname + '/../assets/templates/note.md');

prompt.message = "[MinoriWiki]";

var open = function(file) {
    var ed = require('child_process').spawn(
        config['custom'].editor, [
            file
        ], {
            stdio: 'inherit'
        });

    ed.on('exit', finalize, config);
};

var finalize = function() {
    prompt.start();
    prompt.get({
        properties: {
            message: {
                description: "Please describe your changes"
            }
        }
    }, function (err, result) {
        commit(cwd + '/' + config['dir'].source, result.message, true);
        done();
    });
};

module.exports = function(filename) {
    var file = path.resolve(cwd + '/' + config['dir'].source + '/' + filename + '.md');

    fs.stat(file, function(err, stat) {
        if (!err) {
            console.log('File exists - Opening...');
            open(file);
        } else if (err.code === 'ENOENT') {
            console.log('Creating: ' + file);
            var content = fs.readFileSync(template, 'utf8')
                .replace('[% title %]', filename)
                .replace('[% category %]', config['custom'].category)
                .replace('[% time %]', Date.now());

            mkdirp.sync(path.dirname(file), { mode: '0755' });
            fs.writeFile(file, content, {
                encoding: 'utf8'
            }, function(err) {
                if (err) {
                    console.error(err);
                    console.error('Error creating new page file, please check your Minori installation.');
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
