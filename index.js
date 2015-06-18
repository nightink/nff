'use strict';

var fs = require('fs');
var path = require('path');

var Lazy = require('lazy');
var chardet = require('chardet');
var iconv = require('iconv-lite');
var walk = require('walk');
var debug = require('debug')('nff');

module.exports = function(options, cb) {
  var cwdPath = options.cwdPath,
    findWords = {},
    fileCount = 0;

  // 搜索目录默认为当前目录
  if(!options.wherePaths) {
    options.wherePaths = [cwdPath];
  }
  if(!options.ignores) {
    options.ignores = [];
  }
  options.findKeys.forEach(function(findKeyword) {
    findWords[findKeyword] = [];
  });

  // 遍历所有需要的目录，获取文件名
  options.wherePaths.forEach(function(wherePath) {
    walk.walkSync(path.resolve(cwdPath, wherePath), {
      followLinks: false,
      filters: options.ignoreFilePaths,
      listeners: {
        file: function(root, fileStats, next) {
          var fileExt = path.extname(fileStats.name),
            needIgnore = false;

          options.ignores.filter(function(val) {
            if ('.' + val === fileExt) {
              needIgnore = true;
            }
          });
          if (needIgnore) {
            return;
          }

          fileCount++;
          flowStream(path.resolve(root, fileStats.name));
          next();
        },
        errors: function(root, nodeStatsArray, next) {
          console.log('error', nodeStatsArray);
          next();
        }
      }
    });
  });

  // 遍历搜索文件 进行模糊匹配
  function flowStream(filePath) {
    var encoding = chardet.detectFileSync(filePath);
    var ly = new Lazy(fs.createReadStream(filePath));
    var index = 0;

    ly.lines.forEach(function(bf) {
      // 空文件处理
      if (!bf) {
        return;
      }

      debug('file path %s, encoding %s', filePath, encoding);
      var line;
      if (encoding === 'UTF-32LE') {
        line = bf.toString();
      } else {
        line = iconv.decode(bf, encoding);
      }

      index++;
      options.findKeys.forEach(function(findKeyword) {
        if (line.indexOf(findKeyword) !== -1) {
          findWords[findKeyword].push({
            path: filePath.substr(cwdPath.length + 1),
            index: index,
            line: line
          });
        }
      });
    }).join(function() {
      fileCount--;
      if(!fileCount) {
        cb(null, findWords);
      }
    });
  }
};
