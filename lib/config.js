"use strict";

var fs = require('fs');
var yaml = require('js-yaml');
var cwd = process.cwd();

var cfg = {};

module.exports = function() {
    // Async function?
    try {
        cfg = yaml.safeLoad(fs.readFileSync(cwd + '/config.yml', 'utf8'));
        return cfg;
    } catch (e) {
        if (e.code === 'ENOENT') {
            console.error('Error when reading configuration: File not exist. Are you in the correct directory?');
        } else {
            console.error('Error when reading configuration: ' + e.code);
        }
        process.exit(1);
    }
};
