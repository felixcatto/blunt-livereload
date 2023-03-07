import path from 'path';
import { fileURLToPath } from 'url';
import babelConfig from './babelconfig.js';

const isProduction = process.env.NODE_ENV === 'production';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const common = {
  entry: path.resolve(__dirname, 'client/frontClient.ts'),
  output: {
    filename: 'frontClient.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: { '.js': ['.ts', '.tsx', '.js'] },
  },
  module: {
    rules: [
      {
        test: /(\.js$|\.ts$)/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: babelConfig.client,
        },
      },
    ],
  },

  stats: { warnings: false, children: false, modules: false },
};

let config;
if (isProduction) {
  config = { ...common, mode: 'production' };
} else {
  config = { ...common, mode: 'development', devtool: 'eval-cheap-module-source-map' };
}

export default config;
