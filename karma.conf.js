module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    singleRun: false,
    frameworks: ['jspm', 'jasmine'],
    plugins: ['karma-jspm', 'karma-phantomjs-launcher'],
    jspm: {
        loadFiles: ['src/**/*.js', 'test/**/*.js']
    }

  });
};
