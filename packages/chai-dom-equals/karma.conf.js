/* eslint-disable import/no-extraneous-dependencies */
const createDefaultConfig = require('@open-wc/testing-karma/default-config.js');
const merge = require('webpack-merge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // allows running single tests with the --grep flag
        config.grep ? config.grep : 'test/**/*.test.js',
      ],

      // only smoke tests for chai here
      coverageIstanbulReporter: {
        thresholds: {
          global: {
            statements: 0,
            branches: 0,
            functions: 0,
            lines: 0,
          },
        },
      },
    }),
  );
  return config;
};
