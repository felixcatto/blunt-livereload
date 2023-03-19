export default {
  presets: [['@babel/preset-env', { targets: { node: true } }], '@babel/preset-typescript'],
  plugins: [['replace-import-extension', { extMapping: { '.js': '.cjs' } }]],
};
