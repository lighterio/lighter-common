var fs = require('fs');
var commonDir = __dirname.replace(/commands$/, 'common');
var pattern = /\.js$/;
var list = [];
var wait = 0;
var grep;
var ignore;

module.exports = {

  description: 'Show a list of lighter-common modules',

  options: [
    '-g, --grep <regexp>    Only show the modules that match an expression (RegExp)',
    '-i, --ignore <regexp>  Ignore modules that match an expression (RegExp)'
  ],

  run: function (options) {
    grep = options.grep || /^.*$/;
    ignore = options.ignore || /^$/;
    wait++;
    find(commonDir, 1);
    unwait();
  }

};

function find(path, isMaster) {
  wait++;
  fs.lstat(path, function (error, stat) {
    if (!error && !stat.isSymbolicLink()) {
      if (pattern.test(path)) {
        list.push(path);
        unwait();
        return;
      }
      wait++;
      fs.readdir(path, function (error, files) {
        if (files) {
          files.forEach(function (file) {
            find(path + '/' + file);
          });
        }
        unwait();
      });
    }
    unwait();
  });
}

function unwait() {
  if (!--wait) {
    finish();
  }
}

function finish() {
  console.log('');
  list.sort();
  list.forEach(function (path) {
    var content = '' + fs.readFileSync(path);
    var version;
    content.replace(/@version (\S+)/, function (match, v) {
      version = v;
    });
    var name = path.substr(commonDir.length + 1).replace(pattern, '');
    if (grep.test(name) && !ignore.test(name)) {
      console.log(name + (' @' + version).green);
    }
  });
  console.log('');
}
