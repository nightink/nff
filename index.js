
var fs = require('fs')
var path = require('path')

var lazy = require('lazy')

module.exports = function(program) {

  var cwdPath = process.cwd()
  var filesPath = []
  var ignoreFilePaths = program.ignorePath.split(',')
  var ignores = program.ignore && program.ignore.split(',')
  var findKeys = program.find.split(',')

  // 递归读取文件夹
  function readDir(basePath) {

    var files = fs.readdirSync(basePath)

    files = files.filter(function(fileP) {

      var basename = path.basename(fileP)

      for(var i = 0, len = ignoreFilePaths.length; i < len; i++) {

        if(basename === ignoreFilePaths[i]) {

          return false
        }
      }

      return true
    })

    files.forEach(function(filename) {

      var filePath = path.join(basePath, filename)
      var stat = fs.statSync(filePath)

      if(stat.isDirectory()) {

        readDir(filePath)
      } else {

        var fileExt = path.extname(filename)

        if(ignores) {

          for (var i = 0, len = ignores.length; i < len; i++) {

            if('.' + ignores[i] === fileExt) {

              return
            }
          }
        }

        filesPath.push(filePath)
      }
    })
  }

  readDir(cwdPath)

  console.log('\n\n========== node.js find {%s} list ==========\n\n', findKeys)

  filesPath.forEach(function(filePath) {

    var ly = new lazy(fs.createReadStream(filePath))
    var index = 0

    ly.lines.forEach(function(bf){

      var line = bf.toString()
      index++

      findKeys.forEach(function(findKeyword) {

        if(line.indexOf(findKeyword) !== -1) {

          console.log('\033[1;36m * %s:%s %s \033[0m',
            filePath.substr(cwdPath.length), index, line.replace(/^\s+/,""))
        }
      })
    })
  })

}