const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'client.js': path.resolve(__dirname, 'src/client.js'),
  },
  output: {
    filename: '[name]',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  modules: false,
                  targets: { browsers: ['last 2 Chrome versions'] },
                },
              ],
            ],
          },
        },
      },
    ],
  },

  stats: {
    warnings: false,
    children: false,
    modules: false,
  },
};
