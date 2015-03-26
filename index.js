'use strict';

var fs = require('fs');
var path = require('path');
var format = require('util').format;

var Lazy = require('lazy');
var chardet = require('chardet');
var iconv = require('iconv-lite');
var debug = require('debug')('nff');

module.exports = function(options) {
  var cwdPath = process.cwd();
  var filesPath = [];

  // 递归读取文件夹 收集需要进行搜索的文件路径
  function readDir(basePath) {
    var files = fs.readdirSync(basePath);
    files = files.filter(function(fileP) {
      var basename = path.basename(fileP);

      for(var i = 0, len = options.ignoreFilePaths.length; i < len; i++) {
        if(basename === options.ignoreFilePaths[i]) {
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

        if(options.ignores) {
          for (var i = 0, len = options.ignores.length; i < len; i++) {
            if('.' + options.ignores[i] === fileExt) {
              return;
            }
          }
        }

        filesPath.push(filePath);
      }
    });
  }

  // 判断用户是否有指定路径搜索
  if(!!options.wherePaths) {
    // 遍历获取路径下文件
    options.wherePaths.forEach(function(wherePath) {
      readDir(path.join(cwdPath, wherePath));
    });
  } else {
    readDir(cwdPath);
  }

  var findWords = {};
  options.findKeys.forEach(function(findKeyword) {
    findWords[findKeyword] = [];
  });

  console.log('\n\n========== node.js find {%s} list ==========\n\n', options.findKeys);

  // 遍历搜索文件 进行模糊匹配
  (function flowStream(filePath) {
    var encoding = chardet.detectFileSync(filePath);
    var ly = new Lazy(fs.createReadStream(filePath));
    var index = 0;
    ly.lines.forEach(function(bf) {
      // 空文件处理
      if(!bf) { return; }

      debug('file path %s, encoding %s', filePath, encoding);
      var line;
      if(encoding === 'UTF-32LE') {
        line = bf.toString();
      } else {
        line = iconv.decode(bf, encoding);
      }

      index++;

      options.findKeys.forEach(function(findKeyword) {
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
