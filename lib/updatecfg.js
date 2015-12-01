"use strict";

var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');
var config = require('./config')();

var assetsPath = path.resolve(__dirname + '/../assets/init');

module.exports = function() {
    var newcfg = yaml.safeLoad(fs.readFileSync(path.resolve(assetsPath + '/config.yml'), 'utf8'));
    iterate(config, newcfg, '');
    fs.writeFileSync('./config.yml.new', yaml.safeDump(newcfg));
    console.log('New config wrote to \'config.yml.new\'. Please check and rename to \'config.yml\'');
};

// http://stackoverflow.com/questions/15690706/recursively-looping-through-an-object-to-build-a-property-list
function iterate(oldcfg, newcfg, stack) {
    for (var property in oldcfg) {
        if (oldcfg.hasOwnProperty(property)) {
            if (typeof oldcfg[property] == "object") {
                iterate(oldcfg[property], newcfg[property], stack + '.' + property);
            } else {
                newcfg[property] = oldcfg[property];
            }
        }
    }
}
