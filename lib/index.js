"use strict";

var argv = require('minimist')(process.argv.slice(2));

var fs = require('fs');

var cmdInit = require('./init');
var cmdNote = require('./note');
var cmdDone = require('./done');

module.exports = function() {
    if (argv._[0]) {
        switch(argv._[0]) {
            case 'init':
                cmdInit();
                break;
            case 'note':
                checkConfig();
                if (!argv._[1]) {
                    console.error('You must provide a filename.');
                    printHelp();
                    process.exit(1);
                }
                cmdNote(argv._[1]);
                break;
            case 'done':
                checkConfig();
                cmdDone();
                break;
            case 'deploy':
                checkConfig();
                console.log('This function has not implemented yet. Please, upload your files in ' + config['dir'].site + ' folder to production environment.');
                break;
            case 'help':
                printHelp();
                break;
            default:
                console.log('Unknown command: ' + argv._[0]);
                printHelp();
                process.exit(1);
        }
    } else {
        printHelp();
    }
};

function printHelp() {
    console.log('Usage: minori <command> [file]');
    console.log('\nAvailable commands:\n');
    console.log('\tinit\t\t-\tCreate new work directory at CWD.');
    console.log('\tnote [filename]\t-\tCreate new note file. This command also invokes \'done\' command.');
    console.log('\tdone\t\t-\tFinish job, generate new site files.');
    console.log('\tdeploy\t\t-\tDeploy files to production environment. (Not implemented yet, please deploy files in your site directory manually.)');
    console.log('\thelp\t\t-\tDisplay this instruction.');
}

function checkConfig() {
    fs.stat('./config.yml', function(e, stat) {
        if (e && e.code === 'ENOENT') {
            console.error('Error when reading configuration: File not exist. Are you in the correct directory?');
            process.exit(1);
        } else if (e) {
            console.error('Error when reading configuration: ' + e.code);
            process.exit(1);
        }
    });
}
