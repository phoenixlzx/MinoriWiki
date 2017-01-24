"use strict";

var exec = require('child_process').exec;
var path = require('path');
var ncp = require('ncp');
var mkdirp = require('mkdirp');
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
	// deploy to AWS.
        if (config['deploy'].s3 && config['deploy'].s3.enabled) {
            deploy_s3();
	    return;
        }
	// deploy with git
        exec(cmdPrefix + 'push -f ' + config['deploy'].repo + ' master:' + config['deploy'].branch, function(err) {
            if (err) {
                console.error('Unable to push changes: ' + err);
                process.exit(1);
            } else {
                console.log('Site updated.');
            }
        });
    });
};

function deploy_s3() {
    var s3 = require('s3');
    var fs = require('fs-extra');

    var client = s3.createClient({
        maxAsyncS3: 20,
        s3RetryCount: 3,
        s3RetryDelay: 1000,
        multipartUploadThreshold: 20971520,
        multipartUploadSize: 15728640,
        s3Options: {
            accessKeyId: config['deploy'].s3.accessKeyId,
            secretAccessKey: config['deploy'].s3.accessKeySecret,
            region: config['deploy'].s3.region
        }
    });

    var ncpOpts = {
        filter: function(filepath) {
            var filename = path.basename(filepath);
            return filename.indexOf('.') !== 0;
        }
    };

    var dir = path.resolve(cwd + '/' + config['dir'].site);
    var destdir = path.resolve(cwd + '/.deploy');
    var s3prefix = config['base'].path === '/' ? '' : config['base'].path;

    try {
        fs.removeSync(destdir);
    } catch (e) {
        //
    }
    mkdirp(destdir);

    ncp(dir, destdir, ncpOpts, function(err) {
        var params = {
            localDir: destdir,
            deleteRemoved: true,
            s3Params: {
                Bucket: config['deploy'].s3.bucket,
                Prefix: s3prefix,
                ACL: 'public-read'
            }
        };
        var uploader = client.uploadDir(params);
        uploader.on('error', function(err) {
            console.error("Error:\n", err.stack);
        });
        uploader.on('progress', function() {
            var p = Math.ceil(uploader.progressAmount / uploader.progressTotal * 100);
            if (p) {
                console.log("Progress: ", p + '%');
            }
        });
        uploader.on('end', function() {
            console.log("Site updated.");
        });
    });

}
