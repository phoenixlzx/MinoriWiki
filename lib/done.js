"use strict";

var Q = require('q');
var async = require('async');
var marked = require('marked');
var mjAPI = require("mathjax-node");
var pangunode = require('pangunode');
var ejs = require('ejs');
var ncp = require('ncp');
var recursive = require('recursive-readdir');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var cwd = process.cwd();
var exec = require('child_process').exec;
var config = require('./config')();

var ncpOpts = {
    filter: function(filepath) {
        var filename = path.basename(filepath);
        return filename.indexOf('.') !== 0;
    }
};

mjAPI.start();

module.exports = function() {

    var pages = [];
    var categories = [];
    var fprefix = path.resolve(cwd + '/' + config['dir'].source);

    var gitlog = require('gitlog'),
        options = {
            repo: config['dir'].source,
            number: 20,
            fields: [
                'hash',
                'abbrevHash',
                'subject',
                'committerName',
                'committerDate'
            ]
        };

    recursive(fprefix, ['.*'], function(err, files) {

        async.each(files, function(filename, cb) {
            // ignore non-md files
            if (path.extname(filename) === '.md') {
                var filelink = path.dirname(filename).replace(fprefix, '') + '/' + path.basename(filename, '.md');
                parseFile(filename, fs.readFileSync(path.resolve(filename), 'utf8'), filelink, function(page) {
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
                    cb();
                });
            }
        }, function() {
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
                        path.resolve(cwd + '/' + config['dir'].site + '/page' + page.link),
                        {
                            config: config,
                            categories: categories,
                            page: page
                        }
                    );
                });
            });
        });

        if (config['deploy'].cname) {
            fs.writeFile(path.resolve(cwd + '/' + config['dir'].site + '/CNAME'), config['deploy'].cname + '\n');
        }

        console.log('Pages generated.');
    });

    syncAssets();
    syncSrc();

    if (config['wiki'].log) {
        gitlog(options, function(error, commits) {
            render(
                path.resolve(cwd + '/themes' + '/' + config['wiki'].theme + '/changes.ejs'),
                path.resolve(cwd + '/' + config['dir'].site + '/changelog'),
                {
                    page: {},
                    config: config,
                    commits: commits
                }
            );
        });
    }
};

var parseFile = function(filename, fd, filelink, callback) {

    try {
        var meta = fd.slice(0, fd.indexOf('\n---\n')).split('\n');
        var title = meta[0].split(/title:\s?/i)[1];
        var category = meta[1].split(/category:\s?/i)[1];
        var content = fd.slice(fd.indexOf('\n---\n') + 5);
    } catch (e) {
        console.error('Error when reading content properties, please check file: ' + filename);
        return {};
    }

    content = lastUpdate(filename, content);

    var maths = content.match(/\^{3}math(.*?\n*?)+?\^{3}/gm);
    if (maths && maths.length !== 0) {
        if (!config['custom'].mathjax) {
            console.warn('WARNING: MathJax detected white it is disabled.');
            callback({
                title: title,
                category: category,
                link: filelink,
                content: mdParse(content)
            });
        } else {

            async.eachSeries(maths, function(m, cb) {

                var c = m.split(/(\^{3}math|\^{3})/g)[2];
                mjParse(c, function(mathxml) {
                    content = content.replace(m, mathxml);
                    cb();
                });

            }, function(err) {
                callback({
                    title: title,
                    category: category,
                    link: filelink,
                    content: mdParse(content)
                })
            });
        }

    } else {
        callback({
            title: title,
            category: category,
            link: filelink,
            content: mdParse(content)
        });
    }

};

var syncAssets = function() {
    var themePath = path.resolve(cwd + '/themes' + '/' + config['wiki'].theme + '/assets');
    var assetsPath = path.resolve(cwd + '/' + config['dir'].site);
    mkdirp.sync(path.resolve(assetsPath + '/assets'), { mode: '0755' });
    mkdirp.sync(path.resolve(assetsPath + '/static'), { mode: '0755' });
    ncp(themePath, path.resolve(assetsPath + '/assets'));
    ncp(path.resolve(cwd + '/static'), path.resolve(assetsPath + '/static'));
    if (config['wiki'].favicon) {
        fs.stat('./config.yml', function(e, stat) {
            if (e && e.code === 'ENOENT') {
                console.log('WARNING: favicon configured but not found.');
            } else if (e) {
                console.error('WARNING: Error ' + e.code);
            } else {
                ncp(path.resolve(cwd + '/favicon.ico'), path.resolve(assetsPath + '/favicon.ico'));
            }
        });
    }
};

var syncSrc = function() {
    var srcPath = path.resolve(cwd + '/' + config['dir'].source);
    var dest = path.resolve(cwd + '/' + config['dir'].site + '/' + config['dir'].raw);
    mkdirp.sync(dest, { mode: '0755' });
    ncp(srcPath, dest, ncpOpts, function(err) {
        console.log('Source files synced.');
    });
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

var mjParse = function(data, callback) {

    mjAPI.typeset({
        html: data,
        inputs: ["TeX", "MathML"],
        mml: true
    }, function(result) {
        callback(result.html);
    });

};

var mdParse = function(data) {

    marked.setOptions(config['custom'].markdown);
    var renderer = new marked.Renderer();
    renderer.heading = function (text, level) {
        var escapedText = text.replace(/\s/g, "_"); // remove all characters

        return '<h' + level + '><a name="' +
            escapedText +
            '" class="anchor" href="#' +
            escapedText +
            '" target="_self"><span class="header-link">#</span></a>&nbsp;' +
            text + '</h' + level + '>';
    };

    return config['custom'].autospacing ? pangunode(marked(data, { renderer: renderer })) : marked(data, { renderer: renderer });
};

var lastUpdate = function(file, content) {
    var fstat = fs.statSync(file);
    var sourcepath = file.replace(path.resolve(cwd + '/' + config['dir'].source), config['base'].path + '/' + config['dir'].raw);
    return content + '\n\n_Last Update: ' + fstat.mtime + '_' +
            '  [Source File](/' + sourcepath + ')\n';
};

// http://stackoverflow.com/questions/7176908/how-to-get-index-of-object-by-its-property-in-javascript
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
}
