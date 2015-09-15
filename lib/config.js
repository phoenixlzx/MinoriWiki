"use strict";

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var cwd = process.cwd();

module.exports = function() {
    // Async function?
    try {
        return yaml.safeLoad(fs.readFileSync(path.resolve(cwd + '/config.yml'), 'utf8'));
    } catch (e) {
        return {};
    }
};
