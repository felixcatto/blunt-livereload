export default {
  client: {
    presets: [
      ['@babel/preset-env', { modules: false, targets: { browsers: ['last 2 Chrome versions'] } }],
      '@babel/preset-typescript',
    ],
  },
  server: {
    presets: [
      ['@babel/preset-env', { targets: { node: true } }],
      '@babel/preset-typescript',
    ],
  },
};
