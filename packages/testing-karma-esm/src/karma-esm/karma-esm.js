const merge = require('webpack-merge');
const createCompiler = require('./compiler');

const createBabelOptions = coverage => ({
  sourceType: 'module',
  plugins: [
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-syntax-import-meta'),
    [
      require.resolve('babel-plugin-bare-import-rewrite'),
      {
        rootBaseDir: '.',
        alwaysRootImport: ['**'],
        failOnUnresolved: true,
      },
    ],
    coverage && [
      require.resolve('babel-plugin-istanbul'),
      {
        exclude: ['**/node_modules/**', '**/*.test.js', '**/*.spec.js'],
      },
    ],
  ].filter(_ => _),
  sourceMap: 'inline',
});

const defaultPluginConfig = {
  baseDir: './',
  modulesDir: '/node_modules',
};

function createPluginConfig(karmaConfig) {
  return merge(
    {
      babelOptions: createBabelOptions(karmaConfig.esm && karmaConfig.esm.coverage),
    },
    defaultPluginConfig,
    karmaConfig.esm,
  );
}

function initialize(karmaConfig, karmaEmitter) {
  module.exports.pluginConfig = createPluginConfig(karmaConfig);
  module.exports.compile = createCompiler(module.exports.pluginConfig, karmaEmitter);
}

module.exports = {
  initialize,
};
