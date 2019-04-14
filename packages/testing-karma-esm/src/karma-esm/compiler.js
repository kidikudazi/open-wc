const babel = require('@babel/core');
const minimatch = require('minimatch');
const chokidar = require('chokidar');

function createCompiler(config, karmaEmitter) {
  const cache = new Map();
  const watcher = chokidar.watch([]);

  watcher.on('change', filePath => {
    karmaEmitter.refreshFiles();
    cache.delete(filePath);
  });

  function addToCache(filePath, code) {
    cache.set(filePath, code);
    watcher.add(filePath);
  }

  function babelCompile(filePath, code) {
    return babel.transform(code, {
      filename: filePath,
      ...config.babelOptions,
    }).code;
  }

  function compile(filePath, code) {
    // return from cache if present
    const cached = cache.get(filePath);
    if (cached) {
      return cached;
    }

    // if we should not babel compile some files, only add them to the cache
    if (config.babel && config.babel.exclude) {
      if (config.babel.exclude.some(exclude => minimatch(filePath, exclude))) {
        addToCache(filePath, code);
        return code;
      }
    }

    const compiled = babelCompile(filePath, code);
    addToCache(filePath, compiled);
    return compiled;
  }

  return compile;
}

module.exports = createCompiler;
