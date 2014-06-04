
var fs = require('fs')
var path = require('path')

var lazy = require('lazy')
var commander = require('commander')

commander.version(require('./package.json').version)
  .option('-f, --find [path]', '查找文件', String)
  .parse(process.argv)

var cwdPath = process.cwd()

var filesPath = []

// 递归读取文件夹
function readDir(basePath) {

  var files = fs.readdirSync(basePath)

  files = files.filter(function(fileP) {

    return fileP.indexOf('.svn') === -1
  })

  files.forEach(function(filename) {

    var filePath = path.join(basePath, filename)

    var stat = fs.statSync(filePath)

    if(stat.isDirectory()) {

      readDir(filePath)
    } else {

      filesPath.push(filePath)
    }
  })
}

readDir(cwdPath)

console.log('\n\n========== node.js find {%s} list ==========\n\n', commander.find)

var findKeys = commander.find.split('_')

console.log(findKeys)

filesPath.forEach(function(filePath) {

  if(path.extname(filePath) === '.java') {

    return
  }

  var ly = new lazy(fs.createReadStream(filePath))

  var index = 0

  ly.lines.forEach(function(bf){

    var line = bf.toString()
    index++

    findKeys.forEach(function(findKeyword) {

      if(line.indexOf(findKeyword) !== -1) {

        console.log('\033[1;36m * %s:%s %s \033[0m', filePath.substr(cwdPath.length), index, line.replace(/^\s+/,""))
      }
    })
  })

})