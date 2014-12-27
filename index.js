// 'use strict';

var fs = require('fs');
var path = require('path');
var format = require('util').format;

var Lazy = require('lazy');

module.exports = function(program) {
  var cwdPath = process.cwd();
  var filesPath = [];
  var ignoreFilePaths = program.ignorePath.split(',');
  var ignores = program.ignore && program.ignore.split(',');
  var findKeys = program.find.split(',');
  var wherePaths = program.where && program.where.split(',');

  // 递归读取文件夹
  function readDir(basePath) {
    var files = fs.readdirSync(basePath);
    files = files.filter(function(fileP) {
      var basename = path.basename(fileP);

      for(var i = 0, len = ignoreFilePaths.length; i < len; i++) {
        if(basename === ignoreFilePaths[i]) {
          return false;
        }
      }

      return true;
    });

    files.forEach(function(filename) {
      var filePath = path.join(basePath, filename);
      var stat = fs.statSync(filePath);

      if(stat.isDirectory()) {
        readDir(filePath);
      } else {
        var fileExt = path.extname(filename);

        if(ignores) {
          for (var i = 0, len = ignores.length; i < len; i++) {
            if('.' + ignores[i] === fileExt) {
              return;
            }
          }
        }

        filesPath.push(filePath);
      }
    });
  }

  if(!!wherePaths) {
    // 遍历获取路径下文件
    wherePaths.forEach(function(wherePath) {
      readDir(path.join(cwdPath, wherePath));
    });
  } else {
    readDir(cwdPath);
  }

  var findWords = {};
  findKeys.forEach(function(findKeyword) {
    findWords[findKeyword] = [];
  });

  console.log('\n\n========== node.js find {%s} list ==========\n\n', findKeys);

  (function flowStream(filePath) {
    var ly = new Lazy(fs.createReadStream(filePath));
    var index = 0;
    ly.lines.forEach(function(bf) {
      // 空文件处理
      if(!bf) { return; }

      var line = bf.toString();
      index++;

      findKeys.forEach(function(findKeyword) {
        if(line.indexOf(findKeyword) !== -1) {

          findWords[findKeyword].push('  * '.tsing +
                format('%s:%s', filePath.substr(cwdPath.length + 1), index).yellow +
                ' ' + line.replace(/^\s+/, ''));
        }
      });
    }).join(function() {
      if(!filesPath.length) {

        for(var findKey in findWords) {
          var findWord = findWords[findKey];
          if(!findWord || findWord.length === 0) { return; }

          console.log(format(' **%s** ', findKey).green);
          console.log(findWord.join('\n') + '\n\n');
        }
      } else {
        flowStream(filesPath.pop());
      }
    });
  })(filesPath.pop());
};

// set color string to strout
(function() {
  var colorTable = {
    red: 1,
    gray: 0,
    tsing: 6,
    yellow: 3,
    green: 2,
    blue: 4,
    purple: 5
  };

  function setColor(cr) {
    Object.defineProperty(Object.prototype, cr, {
      set: function() {},
      get: function() {
        return isString(this) ?
                ('\u001b[9' + colorTable[cr] + 'm'+ this.valueOf() +'\u001b[0m')
                : this;
      },
      configurable: true
    });
  }

  for(var c in colorTable) {
    setColor(c);
  }
})();

function isString(str) {
  return Object.prototype.toString.call(str) === '[object String]';
}
