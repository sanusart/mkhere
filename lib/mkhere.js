#!/usr/bin/env node

(function() {

    'use strict';

    // Load dependencies
    var fs = require('fs.extra'),
        path = require('path'),
        colors = require('colors'),
        omelette = require("omelette"),
        config = require('../config/config.json');

    // Paths
    var tplDirName = config.TPL_DIR;
    var tplDir = path.join(getUserHome(), tplDirName);

    var BR = "\r\n";

    var complete = omelette("mkhere <action>");
    complete.on("action", function() {
        var tpls = list(tplDir, false).toString();
        var completions = tpls.split(',');
        return this.reply(completions);
    });
    complete.init();

    // DO STUFF
    if (process.argv[2] === 'list') {
        return list(tplDir, true);
    } else if (process.argv[2] === 'help' || !process.argv[2]) {
        return usage();
    } else if (process.argv[2] === 'init') {
        return init(tplDir);
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
     * init
     */
    function init(dir) {
        fs.mkdir(dir, function(err) {
            if (!err) {
                var baseTpls = fs.readdirSync(path.resolve(__dirname + '/../templates/'));
                baseTpls.forEach(function(file) {
                    console.log('FILE: ', path.join(dir, file));
                    fs.copy(path.resolve(__dirname + '/../templates/' + file), path.join(dir, file), function(err) {
                        if (err) {
                            console.log('Ooops! Some errors ("' + err + '") occurred upon attempt to create example files in: '.red.bold + dir);
                        }
                    });
                });
                console.log('Example template files copied to ' + dir.green.bold + ' directory');
            }
        });
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
        tpls.forEach(function(file) {
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
        fs.readFile(tplName, 'utf8', function(err, data) {
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
            return true;
        }
    }

    /**
     * usage
     */
    function usage() {
        console.log(
            "--------------------------------------------------" + BR +
            "mkhere: Create files based on predefined templates".white.bold + BR +
            "--------------------------------------------------" + BR + BR +
            "Run: ".white + "mkhere init ".green.bold + BR +
            "\t To create " + tplDirName.italic + " directory within your home containing sample templates." + BR +
            "Run: ".white + "mkhere list ".green.bold + BR +
            "\t To list all templates in " + tplDir.italic + BR +
            "Run: ".white + "mkhere tplname.html newname ".green.bold + BR +
            "\t This will create new file " + "newname.html".italic + " based on " + path.join(tplDir, "tplname.html").italic + " in current directory" + BR +
            "Run: ".white + "mkhere html.html ~/Desktop/sa ".green.bold + BR +
            "\t This will create new file " + "sa.html".italic + " based on " + path.join(tplDir, "html.html").italic + " on the desktop" + BR + BR +
            "------------------Auto-completion-----------------" + BR + BR +
            "Run: " + "mkhere --completion >> ~/.mkhere.completion.sh && echo 'source ~/.mkhere.completion.sh' >> ~/.bashrc".green.bold + BR +
            "\tIn order to enable auto-completion in your `BASH` terminal" + BR +
            "Or: " + "echo '. <(./mkhere --completion)' >> .zshrc".green.bold + BR +
            "\tif you're using `ZSH`"
        );
    }

}).call(this);
