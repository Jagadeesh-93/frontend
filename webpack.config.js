const { resolve } = require('path');

module.exports = {
  devtool: "eval-source-map",
  resolve: {
    alias: {
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
    extensions: ['.js', '.jsx'],
  },
};