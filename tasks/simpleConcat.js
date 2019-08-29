'use strict';

function getTask(grunt) {
  return function task() {
    var concat = require('concat');
    var path = require('path');
    var fs = require('fs');

    grunt.log.write('simpleConcat: dependencies loaded').ok();

    var done = this.async();

    var fileObj = validateFiles(this, fs);

    var destPath = path.concat(fileObj.cwd, fileObj.dest);
    var srcPath = path.concat(fileObj.cwd, fileObj.src);
    if (!fs.existsSync(srcPath)) {
      return grunt.fail.fatal('simpleConcat: src html file is not valid');
    }
    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
      grunt.log.write('simpleConcat: dest folder was not available, created').ok();
    }

    var matchingRegex = /<!-- simple:([a-z]+) -->((.|\n|\r)+)<!-- endsimple -->/gm;
    var htmlContent = grunt.file.read(srcPath);
    var matchResult = matchingRegex.exec(htmlContent);
    var fileNamePrefix = matchResult[1];
    var filePaths = matchResult[2].trim().split('\n').map(fpath => fpath.trim());
    var destFilePath = path.concat(destPath, fileNamePrefix + '.js');
    concat(filePaths).then((contents) => {
      grunt.file.write(destFilePath, contents);
      grunt.log.write(`simpleConcat: ${destFilePath} created`).ok();
      htmlContent.replace(matchingRegex, `<script type="text/javascript" src="${destFilePath}"></script>`);
      grunt.file.write(srcPath, htmlContent);
      grunt.log.write(`simpleConcat: ${srcPath} rewritten`).ok();
      done(true);
    });
  }
}

function validateFiles(taskContext, fs) {
  if (!taskContext.files.length) {
    return grunt.fail.fatal('simpleConcat: No src/dest provided');
  }

  var fileObj = taskContext.files[0];

  if (!fileObj.src.endsWith('.html')) {
    return grunt.fail.fatal('simpleConcat: Expecting a single html file as src');
  }

  if (!fs.existsSync(fileObj.cwd)) {
    return grunt.fail.fatal('simpleConcat: Expecting a valid cwd');
  }

  if (!fileObj.dest.trim()) {
    return grunt.fail.fatal('simpleConcat: Expecting a dest folder name');
  }

  return fileObj;
}

/**
 * Finds the js files defined via script tag in html
 * and then concats them, creates a new in dest and update path into html.
 * @param {*} grunt
 */
function simpleConcat(grunt) {
  this.requiresConfig(['simpleConcat']);
  grunt.registerMultiTask(
    'simpleConcat',
    'Replace referenced JS file paths with one single JS in your HTML',
    getTask(grunt)
  );
}

module.exports = simpleConcat;