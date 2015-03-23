"use strict";

var argv = require('minimist')(process.argv.slice(2));

module.exports = function() {
    if (argv._[0]) {
        switch(argv._[0]) {
            case 'init':
                break;
            case 'note':
                break;
            case 'done':
                break;
            case 'deploy':
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
    console.log('\tnote [filename]\t-\tCreate new note file.');
    console.log('\tdone\t\t-\tFinish job, generate new site files.');
    console.log('\tdeploy\t\t-\tDeploy files to production environment. This command also invokes \'done\' command.');
    console.log('\thelp\t\t-\tDisplay this instruction.');
}
