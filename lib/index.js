"use strict";

var argv = require('minimist')(process.argv.slice(2));

var fs = require('fs');
var path = require('path');

var cmdInit = require('./init');
var cmdNote = require('./note');
var cmdDone = require('./done');
var cmdCommit = require('./commit');
var cmdServer = require('./server.js');
var cmdUpdCfg = require('./updatecfg');

module.exports = function () {
    if (argv._[0]) {
        switch (argv._[0]) {
            case 'i':
            case 'init':
                var init_dir;
                if (argv._[1])
                    init_dir = path.join(process.cwd(), argv._[1]);
                else
                    init_dir = process.cwd();
                cmdInit(init_dir);
                break;
            case 'n':
            case 'note':
                checkConfig(function () {
                    if (!argv._[1]) {
                        console.error('You must provide a filename.');
                        printHelp();
                        process.exit(1);
                    }
                    cmdNote(argv._[1]);
                });
                break;
            case 'd':
            case 'done':
                checkConfig(cmdDone);
                break;
            case 'c':
            case 'commit':
                checkConfig(cmdCommit);
                break;
            case 'u':
            case 'updatecfg':
                checkConfig(cmdUpdCfg);
                break;
            case 'help':
                printHelp();
                break;
            case 's':
            case 'server':
                var port = argv._[1] || 8080; // default port is 8080
                cmdServer(port);
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
    console.log('\tinit(i)\t\t\t- Create new work directory at CWD.');
    console.log('\tnote(n) [filename]\t- Create new note file. This command also invokes \'done\' command.');
    console.log('\tdone(d)\t\t\t- Finish job, generate new site files.');
    console.log('\tcommit(c)\t\t- Deploy files to production environment.');
    console.log('\tupdatecfg(u)\t\t- Update current config.yml file with new version.');
    console.log('\thelp\t\t\t- Display this instruction.');
}

function checkConfig(callback) {
    fs.stat('./config.yml', function (e, stat) {
        if (e && e.code === 'ENOENT') {
            console.error('Error when reading configuration: File not exist. Are you in the correct directory?');
            process.exit(1);
        } else if (e) {
            console.error('Error when reading configuration: ' + e.code);
            process.exit(1);
        } else {
            callback();
        }
    });
}
