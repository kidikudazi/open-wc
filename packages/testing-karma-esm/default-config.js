const path = require('path');

const coverage = process.argv.find(arg => arg.includes('coverage'));
const updateSnapshots = process.argv.find(arg => arg.includes('update-snapshots'));
const pruneSnapshots = process.argv.find(arg => arg.includes('prune-snapshots'));

/**
 * Creates a basic karma configuration file.
 *
 * See demo/karma.conf.js for an example implementation.
 */
module.exports = config => ({
  browsers: ['ChromeHeadlessNoSandbox'],

  files: ['__snapshots__/**/*.md'],

  customLaunchers: {
    ChromeHeadlessNoSandbox: {
      base: 'ChromeHeadless',
      flags: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  },

  plugins: [
    // resolve plugins relative to this config so that they don't always need to exist
    // at the top level
    require.resolve('karma-mocha'),
    require.resolve('karma-mocha-reporter'),
    require.resolve('karma-source-map-support'),
    require.resolve('karma-sourcemap-loader'),
    require.resolve('karma-coverage-istanbul-reporter'),
    require.resolve('karma-static'),
    require.resolve('karma-snapshot'),
    require.resolve('karma-mocha-snapshot'),
    require.resolve('karma-chrome-launcher'),
    require.resolve('./src/karma-esm'),

    // fallback: resolve any karma- plugins
    'karma-*',
  ],

  frameworks: ['esm', 'mocha', 'snapshot', 'mocha-snapshot', 'source-map-support'],

  middleware: ['esm', 'static'],

  static: {
    path: path.join(process.cwd(), ''),
  },

  preprocessors: {
    '**/__snapshots__/**/*.md': ['snapshot'],
    '**/*.test.js': ['esm'],
    '**/*.spec.js': ['esm'],
  },

  reporters: coverage ? ['mocha', 'coverage-istanbul'] : ['mocha'],

  mochaReporter: {
    showDiff: true,
  },

  restartOnFileChange: true,

  client: {
    mocha: {
      reporter: 'html',
      allowUncaught: true,
    },
  },

  esm: {
    coverage,
    babel: {
      exclude: ['**/node_modules/sinon/**', '**/@bundled-es-modules/**'],
    },
  },

  colors: true,

  // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
  logLevel: config.LOG_INFO,

  /** Some errors come in JSON format with a message property. */
  formatError(error) {
    try {
      if (typeof error !== 'string') {
        return error;
      }
      const parsed = JSON.parse(error);
      if (typeof parsed !== 'object' || !parsed.message) {
        return error;
      }
      return parsed.message;
    } catch (_) {
      return error;
    }
  },

  // ## code coverage config
  coverageIstanbulReporter: {
    reports: ['html', 'lcovonly', 'text-summary'],
    dir: 'coverage',
    combineBrowserReports: true,
    skipFilesWithNoCoverage: false,
    thresholds: {
      global: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },

  snapshot: {
    update: updateSnapshots,
    prune: pruneSnapshots,
    pathResolver(basePath, suiteName) {
      return path.join(basePath, '__snapshots__', `${suiteName}.md`);
    },
  },

  autoWatch: false,
  singleRun: true,
  concurrency: Infinity,
});
