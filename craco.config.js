module.exports = {
  webpack: {
    alias: {
      react: 'react', // Points to the module name, resolved by Webpack
      'react-dom': 'react-dom',
    },
    configure: (webpackConfig) => {
      webpackConfig.resolve.extensions = ['.js', '.jsx', ...webpackConfig.resolve.extensions];
      return webpackConfig;
    },
  },
};