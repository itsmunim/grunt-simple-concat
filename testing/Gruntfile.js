'use strict';
var simpleConcatTask = require('../tasks/simpleConcat');

module.exports = function (grunt) {
  grunt.initConfig({
    simpleConcat: {
      main: {
        src: 'app/index.html',
        dest: 'dist',
        scriptsDir: 'scripts',
        cwd: './'
      }
    }
  });

  simpleConcatTask(grunt);

  grunt.registerTask('default', [
    'simpleConcat'
  ]);
};
