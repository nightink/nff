'use strict';

var fs = require('fs');
var path = require('path');

var Lazy = require('lazy');
var chardet = require('chardet');
var iconv = require('iconv-lite');
var debug = require('debug')('nff');

module.exports = function(options, cb) {
  var cwdPath = options.cwdPath;
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
          findWords[findKeyword].push({
            path: filePath.substr(cwdPath.length + 1),
            index: index,
            line: line
          });
        }
      });
    }).join(function() {
      if(!filesPath.length) {
        cb(null, findWords);
      } else {
        flowStream(filesPath.pop());
      }
    });
  })(filesPath.pop());
};
