"use strict";

var fs = require('fs');
var yaml = require('js-yaml');
var cwd = process.cwd();

module.exports = function() {
    // Async function?
    try {
        return yaml.safeLoad(fs.readFileSync(cwd + '/config.yml', 'utf8'));
    } catch (e) {
        return {};
    }
};
