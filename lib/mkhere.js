#! /usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var colors = require('colors');

var tplDir = path.join(getUserHome(), '.templates');
var BR = "\r\n";

if (process.argv[2] === 'list') {
    return list(tplDir);
} else if (process.argv[2] === 'help') {
    return usage();
} else {
    return mk(tplDir);
}

function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function list(dir) {
    var tpls = fs.readdirSync(dir);
    tpls.forEach(function (file) {
        console.log(file);
    });
}

function usage() {
    console.log(
        BR + "mkhere: Create files based on predefined emplates".inverse + BR + BR +
            "mkhere list ".green.bold + BR +
            "\t List all templates in " + tplDir.italic + BR +
            "mkhere tplname.html newname ".green.bold + BR +
            "\t Will create new file " + "newname.html".italic + " based on " + path.join(tplDir, "tplname.html").italic + " in current directory"
    );
}

function mk(tplDir) {
    var CWD = process.cwd();
    var tplFile = process.argv[2];
    var tplName = path.join(tplDir, tplFile);
    var newFileExt = tplFile.slice(tplFile.indexOf('.'));
    var newFile = process.argv[3] + newFileExt;
    fs.readFile(tplName, 'utf8', function (err, data) {
        if (err) {
            return console.log(
                'Error! No such template file '.red + tplFile.red.bold + ' in '.red + tplDir.red + BR +
                    "For usage see: " + "mkhere help".bold
            );
        }
        fs.writeFile(path.join(CWD,newFile), data);
    });
}