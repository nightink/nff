node-nff
=========

node.js find file cli


### Use

```shell

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

$ nff -p node_modules,.git -f Lazy


========== node.js find {Lazy} list ==========


  *  **Lazy**  index.js:4 var Lazy = require('lazy')
  *  **Lazy**  index.js:65 var ly = new Lazy(fs.createReadStream(filePath))

```
