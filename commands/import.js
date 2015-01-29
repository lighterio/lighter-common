var fs = require('fs');
var dirname = require('path').dirname;
var root = dirname(__dirname);
var mkdirp = require(root + '/common/fs/mkdirp-sync');
var short = require(root + '/common/fs/shorten-path');
var sourceDir = root + '/common/';
var destDir = process.cwd() + '/common/';

module.exports = {

  description: 'Import lighter-common modules into the current directory',

  options: [
    '-d, --dry-run     Show what would be changed, but don\'t change anything'
  ],

  extras: 'modules',

  run: function (options) {
    var self = this;
    self.options = options;
    self.found = {};
    console.log('');
    options.modules.forEach(self.import, self);
    console.log('');
  },

  /**
   * Import a module by lighter-common name, such as "process/cli".
   */
  import: function (module, isDependency) {
    var self = this;
    var options = self.options;

    // Prevent circular dependency loops.
    if (!self.found[module]) {
      self.found[module] = true;

      // Find the module file.
      var path = module.replace(/(\/[^\.]+)$/, '$1.js');
      var source = sourceDir + path;
      var dest = destDir + path;
      if (fs.existsSync(source)) {
        if (options.dryRun) {
          console.log('Import'.green + ': '.gray + short(source).cyan + ' > '.gray + short(dest));
        }
        else {

          // Read content so we can copy it.
          var content = fs.readFileSync(source);
          var dir = dirname(dest);
          var sourceTime = 0;
          var destTime = 0;
          var prefix = isDependency ? 'Dependency ' : '';
          try {
            sourceTime = fs.statSync(source).mtime;
            destTime = fs.statSync(dest).mtime;
          }
          catch (e) {
            // Assume the file is old or non-existent.
          }

          // Copy the file if it's fresher than what's already there.
          if (sourceTime > destTime) {
            mkdirp(dir, function (error) {
              if (error) throw error;
              fs.writeFileSync(dest, content);
            });
          }
          // Otherwise, we've already imported.
          else {
            prefix += 'Already ';
          }

          console.log((prefix + 'Imported').green + ': '.gray + short(source).cyan + ' > '.gray + short(dest));

          // Import dependencies as well.
          ('' + content).replace(/@import\s+(\S+)/g, function (match, module) {
            self.import(module, true);
          });
        }
      }
      else {
        console.log(('File not found: "' + source + '".').red);
      }
    }
  }

};
