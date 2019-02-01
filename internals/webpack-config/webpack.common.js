const path = require('path');
const webpack = require('webpack');
const { src_dir, dst_dir } = require('../../config');

module.exports = {
  entry: {
    index: path.join(src_dir, 'scripts', 'index.js'),
  },
  output: {
    chunkFilename: '[name].bundle.js',
    path: dst_dir,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|otf|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
        use: [ 'file-loader' ],
      },
    ],
  },
};
