node-nff
=========

[![NPM version](https://img.shields.io/npm/v/nff.svg?style=flat)](https://www.npmjs.org/package/nff)
[![Build Status](https://api.travis-ci.org/nightink/nff.png)](http://travis-ci.org/nightink/nff)

[![NPM](https://nodei.co/npm/nff.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/nff/)
[![NPM](https://nodei.co/npm-dl/nff.png)](https://nodei.co/npm/nff/)

node.js find file cli

支持中文编码搜索

### Use

```shell
  $ npm install -g nff
  $ nff -h

  Usage: nff [options]

  Options:

    -h, --help            output usage information
    -V, --version         output the version number
    -f, --find [s]        find file(Examples: $ nff -f findKeyword1,findKeyword2)
    -w, --where [s]       where path(Examples: $ nff -w java,xml)
    -i, --ignore [s]      ignore file(Examples: $ nff -i java,xml)
    -g, --ignorePath [s]  ignore file path(Default: .svn, .git, Examples: $ nff -g .git,bin)

```

### Examples

```shell

➜  node-nff git:(master) ✗ nff -f Lazy,path -p node_modules,.git,list


========== node.js find {Lazy,path} list ==========


 **Lazy**

  * index.js:5 var Lazy = require('lazy');
  * index.js:73 var ly = new Lazy(fs.createReadStream(filePath));
  * README.md:29 $ nff -p node_modules,.git -f Lazy
  * README.md:32 ========== node.js find {Lazy} list ==========
  * README.md:35 *  **Lazy**  index.js:4 var Lazy = require('lazy');
  * README.md:36 *  **Lazy**  index.js:65 var ly = new Lazy(fs.createReadStream(filePath));


 **path**

  * index.js:2 var path = require('path');
  * index.js:22 var basename = path.basename(fileP);
  * index.js:37 var filePath = path.join(basePath, filename);
  * index.js:45 var fileExt = path.extname(filename);
  * bin/nff:8 .option('-p, --ignorePath [ignore file path]',
  * bin/nff:9 'ignore file path(Default: .svn, .git, Examples: $ nff -p .git,bin)', String, '.svn,.git');
  * README.md:21 -p, --ignorePath [ignore file path]  ignore file path(Default: .svn, .git, Examples: $ nff -p .git,bin);

```
