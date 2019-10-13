'use strict';
var simpleConcatTask = require('../tasks/simpleConcat');

module.exports = function (grunt) {
  grunt.initConfig({
    simpleConcat: {
      main: {
        src: 'app/index.html',
        dest: 'dist',
        cwd: './'
      }
    }
  });

  simpleConcatTask(grunt);

  grunt.registerTask('default', [
    'simpleConcat'
  ]);
};
