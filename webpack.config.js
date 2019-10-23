const path = require('path');

module.exports = {
  entry: './src/js/main.js',
  mode: 'development',
  output: {
    filename: 'beebc_bundle.js',
    path: path.resolve(__dirname, 'dist/js')
  }
};