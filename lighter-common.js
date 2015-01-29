#!/usr/bin/env node
if (process.mainModule == module) {
  require(__dirname + '/common/process/cli')({
    aliases: {
      l: 'list',
      i: 'import',
      s: 'sync'
    }
  });
}

// The common module can be called externally.
var common = module.exports;

common.import = require(__dirname + '/commands/import');
common.sync = require(__dirname + '/commands/sync');

// Expose the version number, but only load package JSON if a get is performed.
Object.defineProperty(common, 'version', {
  enumerable: false,
  get: function () {
    return require(__dirname + '/package.json').version;
  }
});
