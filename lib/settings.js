"use strict";

var path = require('path');

var BASE_DIR = path.resolve(__dirname, "../");
var ASSETS_PATH = path.join(BASE_DIR, 'assets/init/');
var NOTE_TEMPLATE_PATH = path.join(BASE_DIR, 'assets/templates/note.md');

module.exports = {
    BASE_DIR: BASE_DIR,
    ASSETS_PATH: ASSETS_PATH,
    NOTE_TEMPLATE_PATH: NOTE_TEMPLATE_PATH
};
