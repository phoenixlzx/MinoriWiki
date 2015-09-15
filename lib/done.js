"use strict";

var marked = require('marked');
var ejs = require('ejs');
var ncp = require('ncp');
var recursive = require('recursive-readdir');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var config = require('./config')();

module.exports = function() {

    var pages = [];
    var categories = [];
    var fprefix = path.resolve(cwd + '/' + config['dir'].source);
    var files = fs.readdirSync(fprefix);

    files.forEach(function(filename) {
        // ignore dot files and non-md files
        if (filename.indexOf('.') !== 0 || path.extname(filename) === '.md') {
            var page = parseFile(filename, fs.readFileSync(path.resolve(fprefix + '/' + filename), 'utf8'));
            pages.push(page);

            var ci = findWithAttr(categories, 'name', page.category);
            if (typeof ci === 'number') {
                categories[ci].pages.push(page);
            } else {
                categories.push({
                    name: page.category,
                    pages: [
                        page
                    ]
                });
            }
        }
    });

    syncAssets();

    render(
        path.resolve(cwd + '/themes' + '/' + config['wiki'].theme + '/index.ejs'),
        path.resolve(cwd + '/' + config['dir'].site), {
        config: config,
        categories: categories,
        page: {}
    });

    categories.forEach(function(category) {
        category.pages.forEach(function(page) {
            render(
                path.resolve(cwd + '/themes' + '/' + config['wiki'].theme + '/page.ejs'),
                path.resolve(cwd + '/' + config['dir'].site + '/page/' + page.link),
                {
                    config: config,
                    categories: categories,
                    page: page
                }
            );
        });
    });

    if (config['deploy'].cname) {
        fs.writeFile(path.resolve(cwd + '/' + config['dir'].site + '/CNAME'), config['deploy'].cname + '\n');
    }

    console.log('Pages generated.');
};

var parseFile = function(filename, fd) {
    marked.setOptions(config['custom'].markdown);
    var meta = fd.slice(0, fd.indexOf('\n---\n')).split('\n');
    var title = meta[0].split(/title:\s?/i)[1];
    var category = meta[1].split(/category:\s?/i)[1];
    var content = fd.slice(fd.indexOf('\n---\n') + 5);
    return {
        title: title,
        category: category,
        link: filename.slice(0, filename.lastIndexOf(path.extname(filename))),
        content: marked(content)
    };
};

var syncAssets = function() {
    var themePath = path.resolve(cwd + '/themes' + '/' + config['wiki'].theme + '/assets');
    var assetsPath = path.resolve(cwd + '/' + config['dir'].site);
    mkdirp.sync(path.resolve(assetsPath + '/assets'), { mode: '0755' });
    mkdirp.sync(path.resolve(assetsPath + '/static'), { mode: '0755' });
    ncp(themePath, path.resolve(assetsPath + '/assets'));
    ncp(path.resolve(cwd + '/static'), path.resolve(assetsPath + '/static'));
};

var render = function(templatePath, destPath, data) {
    mkdirp.sync(destPath, { mode: '0755' });
    var templateFileData = fs.readFileSync(templatePath, 'utf8');
    fs.writeFile(path.resolve(destPath + '/index.html'), ejs.render(templateFileData, data, {
        filename: templatePath,
        rmWhitespace: true
    }), function(err) {
        if (err) {
            console.error('Error when compile page: ' + destPath);
            console.error(err);
            process.exit(1);
        }
        console.log('Rendered: ' + path.resolve(destPath + '/index.html'));
    });
};

// http://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}
