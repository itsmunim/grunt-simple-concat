'use strict';

function getTask(grunt) {
  return function task() {
    var concat = require('concat');
    var path = require('path');
    var fs = require('fs');
    var minify = require('minify');
    var cheerio = require('cheerio');
    var done = this.async();
    var context = prepareContext(grunt, this, fs);

    /** bind context */
    log = log.bind(context);
    getNpmDependencyPaths = getNpmDependencyPaths.bind(context);
    doMinify = doMinify.bind(context);

    log('success', 'simpleConcat: dependencies loaded');

    var destPath = path.join(context.cwd, context.dest);
    var srcPath = path.join(context.cwd, context.src);
    var scriptsPath = path.join(context.cwd, context.scriptsDest);

    if (!fs.existsSync(srcPath)) {
      return log('fail', 'simpleConcat: src html file is not valid');
    }

    if (!fs.existsSync(destPath)) {
      fs.mkdirSync(destPath);
      log('success', 'simpleConcat: dest folder was not available, created');
    }

    var matchingRegex = /<!-- simple:([a-z]+) -->((.|\n|\r)+)<!-- endsimple -->/gm;
    var htmlContent = grunt.file.read(srcPath);
    var matchResult = matchingRegex.exec(htmlContent);
    var fileNamePrefix = matchResult[1];
    var vendorFilePath = path.join(scriptsPath, fileNamePrefix + '.js');
    var relativeVendorFilePath = vendorFilePath.replace(context.dest + '/', '');

    concat(getNpmDependencyPaths(cheerio, path, htmlContent))
      .then((contents) => {
        grunt.file.write(vendorFilePath, contents);
        log('success', `simpleConcat: ${vendorFilePath} created`);
        return doMinify(minify, vendorFilePath);
      }).then(() => {
        htmlContent = htmlContent.replace(matchingRegex,
          `<script type="text/javascript" src="${relativeVendorFilePath}"></script>`);
        grunt.file.write(path.join(destPath, path.basename(srcPath)), htmlContent);
        log('success', `simpleConcat: ${srcPath} rewritten`);
        done(true);
      }).catch((ex) => {
        log('fail', `simpleConcat: something bad happened. error: ${ex.message}`);
        done(true);
      });
  }
}

/**
 * A helper to log stuffs using grunt logger
 * @param {*} type 
 * @param {*} text 
 */
function log(type, text) {
  switch (type) {
    case 'success': {
      this.grunt.log.write(text + ' ').ok();
      break;
    }
    case 'fail': {
      this.grunt.fail.fatal(text);
      break;
    }
  }
}

/**
 * Returns all the npm module paths used in the given src html file
 * by appending it with current working dir
 * @param {*} cheerio 
 * @param {*} path
 * @param {*} htmlContent 
 */
function getNpmDependencyPaths(cheerio, path, htmlContent) {
  var $ = cheerio.load(htmlContent, { xmlMode: false });
  var cwd = this.cwd;
  var prefix = 'node_modules/';
  var npmDependencies = $('script')
    .filter(function (_, scriptTag) {
      return !isEmpty(scriptTag) && scriptTag.attribs['src'].includes(prefix);
    }).map(function (_, scriptTag) {
      var src = scriptTag.attribs['src'];
      var lastEnd = lastEndOfFoundStr(src, prefix);
      return lastEnd > -1 ? path.join(cwd, prefix, src.substr(lastEnd)) : '';
    });

  return Array.from(npmDependencies);
}

/**
 * A simple isEmpty implementation for any kind of javascript object/string
 * @param {*} thing 
 */
function isEmpty(thing) {
  var isStr = typeof thing === 'string';
  return isStr ? thing.trim() === ''
    : (thing === null || thing === undefined || JSON.stringify(thing) === '{}');
}

/**
 * Using minify js, minify the given script file
 * @param {*} minify 
 * @param {*} filePath 
 */
function doMinify(minify, filePath) {
  var grunt = this.grunt;
  return minify(filePath).then((minifiedContent) => {
    grunt.file.write(filePath, minifiedContent);
    log('success', `simpleConcat: ${filePath} rewritten as minified`);
  });
}

/**
 * Finds last end index of a found substring
 * e.g. given = /a/bcd/k, strToFind = bcd/, returns 7
 * @param {*} given 
 * @param {*} strToFind 
 */
function lastEndOfFoundStr(given, strToFind) {
  var presenceIdx = given.indexOf(strToFind);
  return presenceIdx > -1 ? presenceIdx + strToFind.length : -1;
}

function prepareContext(grunt, task, fs) {
  var taskData = task.data;

  if (!taskData.src) {
    return grunt.fail.fatal('simpleConcat: No src index file path given');
  }

  if (!taskData.dest) {
    return grunt.fail.fatal('simpleConcat: No dest path given');
  }

  var scriptsDest = taskData.scriptsDir
    ? taskData.dest + '/' + taskData.scriptsDir : taskData.dest;

  var context = {
    dest: taskData.dest,
    src: taskData.src,
    cwd: taskData.cwd,
    scriptsDest: scriptsDest,
    grunt: grunt,
    task: task
  };

  if (!context.src.endsWith('.html')) {
    return grunt.fail.fatal('simpleConcat: Expecting a single html file as src');
  }

  if (!fs.existsSync(context.cwd)) {
    return grunt.fail.fatal('simpleConcat: Expecting a valid cwd');
  }

  if (!context.dest.trim()) {
    return grunt.fail.fatal('simpleConcat: Expecting a dest folder name');
  }

  return context;
}

/**
 * Finds the js files defined via script tag in html
 * and then concats them, creates a new in dest and update path into html.
 * @param {*} grunt
 */
function simpleConcat(grunt) {
  grunt.registerMultiTask(
    'simpleConcat',
    'Replace referenced JS file paths with one single JS in your HTML',
    getTask(grunt)
  );
}

module.exports = simpleConcat;