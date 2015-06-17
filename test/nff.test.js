'use strict';

describe('nff', function() {
  var cwd = process.cwd();
  var nff = require('..');
  it('cli output result', function(done) {
    var coffee = require('coffee');
    coffee.spawn(cwd + '/bin/nff', ['-f', 'http'], { cwd: cwd + '/test/fixtures' })
      .expect('stdout', /http|\:0/)
      .expect('code', 0)
      .end(done);
  });

  it('module output result', function(done) {
    nff({
      findKeys: ['http'],
      cwdPath: cwd + '/test/fixtures',
      ignoreFilePaths: ['.svn', '.git']
    }, function(err, data) {
      data.should.have.property('http').with.lengthOf(3);
      done();
    });
  });
});
