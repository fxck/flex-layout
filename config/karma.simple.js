// @AngularLayouts

var clone = require('clone');

module.exports = function (config) {
  var webpackConfig = clone(require('./webpack.simple.js'));

      delete webpackConfig.entry;

  config.set({

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    // we are building the test environment in ./spec-bundle.js
    files: ['../test/unit/media-query/*.spec.ts'],

    plugins: [
      require('karma-chrome-launcher'),
      require('karma-jasmine'),
      require('karma-webpack'),
      require('karma-sourcemap-loader'),
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '../test/unit/**/*.spec.ts': ['webpack', 'sourcemap']
    },

    // Webpack Config at ./webpack.test.js
    webpack: webpackConfig,

    // Webpack please don't spam the console when running in karma!
    webpackMiddleware: {  noInfo: true  },
    webpackServer: {noInfo: true},

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_DEBUG,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: [
      'Chrome'
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });

};
