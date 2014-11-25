'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

var Lazy = require('lazy');

module.exports = function(program) {
  var cwdPath = process.cwd();
  var filesPath = [];
  var ignoreFilePaths = program.ignorePath.split(',');
  var ignores = program.ignore && program.ignore.split(',');
  var findKeys = program.find.split(',');
  var wherePaths = program.where.split(',');

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

  if(!!wherePaths.length) {
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
      if(!bf) {
        return;
      }

      var line = bf.toString();
      index++;

      findKeys.forEach(function(findKeyword) {

        if(line.indexOf(findKeyword) !== -1) {
          var formatStr = util.format('\033[1;36m  * \033[3;33m%s:%s\033[0m %s \033[0m',
              filePath.substr(cwdPath.length + 1), index, line.replace(/^\s+/,""));

          findWords[findKeyword].push(formatStr);
        }
      });
    }).join(function() {
      if(!filesPath.length) {

        for(var findKey in findWords) {
          var findWord = findWords[findKey];
          if(!findWord || findWord.length === 0) { return; }

          console.log('\033[3;32m **%s** \033[0m\n', findKey);
          findWord.forEach(function(fdWord) {
            console.log(fdWord);
          });
          console.log('\n');
        }
      } else {
        flowStream(filesPath.pop());
      }
    });
  })(filesPath.pop());
};
