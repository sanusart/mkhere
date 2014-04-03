#! /usr/bin/env node
(function () {

    'use strict';

    // Load dependencies
    var fs = require('fs'),
        path = require('path'),
        colors = require('colors'),
        omelette = require("omelette");

    // Paths
    var tplDirName = '.templates';
    var tplDir = path.join(getUserHome(), tplDirName);

    var BR = "\r\n";

    var complete = omelette("mkhere <action>");
    complete.on("action", function () {
        var tpls = list(tplDir, false).toString();
        var completions = tpls.split(',');
        return this.reply(completions);
    });
    complete.init();

    // Work
    if (process.argv[2] === 'list') {
        return list(tplDir, true);
    } else if (process.argv[2] === 'help' || !process.argv[2]) {
        return usage();
    } else {
        return mk(tplDir);
    }
    /**
     * getUserHome
     * @returns {String}
     */
    function getUserHome() {
        return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    }

    /**
     * list
     * @param dir
     * @param print
     * @returns {Array} or {String}
     */
    function list(dir, print) {
        var tpls = fs.readdirSync(dir);
        var files = [];
        tpls.forEach(function (file) {
            // match temp files
            if (isHiddenFile(file)) {
                files.push(file);
            }
        });
        if (tpls && print) {
            console.log(files.join("\n"));
        } else {
            return files;
        }
    }

    /**
     * mk
     * @param tplDir
     */
    function mk(tplDir) {
        var tplFile = process.argv[2];
        var tplName = path.join(tplDir, tplFile);
        var newFileExtArray = tplFile.split(/\s*\.\s*/);
        var newFileExt = '';
        if (newFileExtArray.length > 1) {
            newFileExtArray.shift();
            newFileExt = '.' + newFileExtArray.join('.');
        }
        var newFile = process.argv[3] + newFileExt;
        fs.readFile(tplName, 'utf8', function (err, data) {
            if (err) {
                return console.log(
                    'Error! No such template file '.red + tplFile.red.bold + ' in '.red + tplDir.red + BR +
                    "For usage see: " + "mkhere help".bold
                );
            }
            fs.writeFile(newFile, data);
        });
    }

    /**
     * isHiddenFile
     * @param file
     * @returns {boolean}
     */
    function isHiddenFile(file) {
        if (file.charAt(file.length - 1) !== '~' && file !== '.DS_Store') {
            return true
        }
    }

    /**
     * usage
     */
    function usage() {
        console.log(
            "--------------------------------------------------" + BR +
            "mkhere: Create files based on predefined templates".white.bold + BR +
            "--------------------------------------------------" + BR +
            "Run: ".white + "mkhere list ".green.bold + BR +
            "\t To list all templates in " + tplDir.italic + BR +
            "Run: ".white + "mkhere tplname.html newname ".green.bold + BR +
            "\t This will create new file " + "newname.html".italic + " based on " + path.join(tplDir, "tplname.html").italic + " in current directory" + BR +
            "Run: ".white + "mkhere html.html ~/Desktop/sa ".green.bold + BR +
            "\t This will create new file " + "sa.html".italic + " based on " + path.join(tplDir, "html.html").italic + " on the desktop" + BR +
            "------------------Auto-completion-----------------" + BR + BR +
            "Run: " + "mkhere --completion >> ~/.mkhere.completion.sh && echo 'source ~/.mkhere.completion.sh' >> ~/.bashrc".green.bold + BR +
            "\tIn order to enable auto-completion in your `BASH` terminal" + BR +
            "Or: " + "echo '. <(./githubber --completion)' >> .zshrc".green.bold + BR +
            "\tif you're using `ZSH`"
        );
    }

}).call(this);