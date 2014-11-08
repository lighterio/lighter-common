#!/usr/bin/env node

// When running directly, start the CLI.
if (process.mainModule == module) {

  var shellify = require('shellify');
  shellify({
    commands: {
      import: {
        note: 'Import one or more common files to the current directory',
        alias: 'i',
        options: {
          dryRun: 'Show what would be changed, but do not make changes'
        }
      },
      sync: {
        note: 'Update common files inside the current directory',
        alias: 's',
        options: {
          dryRun: 'Show what would be changed, but do not make changes'
        }
      }
    }
  });

}

// The common module can be called externally.
var common = module.exports;

common.import = require('./commands/import.js');
common.sync = require('./commands/sync.js');

// Expose the version number, but only load package JSON if a get is performed.
Object.defineProperty(common, 'version', {
  enumerable: false,
  get: function () {
    return require('./package.json').version;
  }
});
