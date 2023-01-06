const path = require('path');
const packageJSON = require('./package.json');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js'],
    fallback: { path: require.resolve('path-browserify') },
  },
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: `standard-charts_v${packageJSON.version}.js`,
    library: 'StandardCharts',
    libraryExport: 'default',
  },
};
