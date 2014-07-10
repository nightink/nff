node-nff
=========

node.js find file cli


### Use

```shell
  $ npm install -g nff
  $ nff -h

  Usage: nff [options]

  Options:

    -h, --help                           output usage information
    -V, --version                        output the version number
    -f, --find [find file]               find file(Examples: $ nff -f findKeyword1,findKeyword2)
    -i, --ignore [ignore file]           ignore file(Examples: $ nff -i java,xml)
    -p, --ignorePath [ignore file path]  ignore file path(Default: .svn, .git, Examples: $ nff -p .git,bin)

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
