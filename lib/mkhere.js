#! /usr/bin/env node

(function () {

    'use strict';

    var fs = require('fs'),
        path = require('path'),
        colors = require('colors'),
        omelette = require("omelette");

    var complete = omelette("mkhere <action>");

    complete.on("action", function () {
        return this.reply(["list", "help"]);
    });
    complete.init();

    var tplDir = path.join(getUserHome(), '.templates');
    var BR = "\r\n";

    if (process.argv[2] === 'list') {
        return list(tplDir);
    } else if (process.argv[2] === 'help' || !process.argv[2]) {
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
            "--------------------------------------------------" + BR +
            "mkhere: Create files based on predefined templates".white.bold + BR +
            "--------------------------------------------------" + BR +
            "Run: ".white + "mkhere list ".green.bold + BR +
            "\t To list all templates in " + tplDir.italic + BR +
            "Run: ".white + "mkhere tplname.html newname ".green.bold + BR +
            "\t This will create new file " + "newname.html".italic + " based on " + path.join(tplDir, "tplname.html").italic + " in current directory" + BR + BR +
            "------------------Auto-completion-----------------" + BR + BR +
            "Run: " + "mkhere --completion >> ~/.mkhere.completion.sh && echo 'source ~/.mkhere.completion.sh' >> .bash_profile".green.bold + BR +
            "\tIn order to enable auto-completion in your `BASH` terminal" + BR +
            "Or: " + "echo '. <(./githubber --completion)' >> .zshrc".green.bold + BR +
            "\tif you're using `ZSH`"
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
            fs.writeFile(path.join(CWD, newFile), data);
        });
    }
}).call(this);