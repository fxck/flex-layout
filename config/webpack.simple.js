var webpack = require('webpack');
var helpers = require('./helpers');

module.exports = {  
  entry: {
    "angular-layouts": "./src/index.ts",
    "angular-layouts.min": "./src/index.ts"
  },
  devtool: 'inline-source-map',
  output: {
    path: './dist',
    filename: '[name].js',
    sourceMapFilename : '[name].js.map'
  },
  resolve: {
    // Make sure root is src
    root: helpers.root('.'),
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
  },
  module: {
    loaders: [
      {test: /\.ts/, loaders: ['ts-loader'], exclude: /node_modules/}
    ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.[a-z]+$/,
      minimize: true
    })
  ]
}
