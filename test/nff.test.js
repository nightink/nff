'use strict';

describe('nff', function() {
  var cwd = process.cwd();
  var nff = require('..');

  it('cli output result', function(done) {
    var coffee = require('coffee');
    coffee.spawn(cwd + '/bin/nff', ['-f', 'http'], {cwd: cwd + '/test/fixtures'})
      .expect('stdout', /http/)
      .expect('stdout', /index.js\:3/)
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

  it('need ignore files', function(done) {
    nff({
      findKeys: ['http'],
      cwdPath: cwd + '/test/fixtures',
      ignoreFilePaths: ['.svn', '.git'],
      ignores: ['txt']
    }, function(err, data) {
      data.should.have.property('http').with.lengthOf(2);
      done();
    });
  });

  it('find different encoding files', function(done) {
    nff({
      findKeys: ['header'],
      cwdPath: cwd + '/test/fixtures',
      ignoreFilePaths: ['.svn', '.git']
    }, function(err, data) {
      data.should.have.property('header').with.lengthOf(2);
      done();
    });
  });

  it('fixed issue#3', function(done) {
    nff({
      findKeys: ['http'],
      cwdPath: cwd + '/test/fixtures',
      ignoreFilePaths: ['.svn', '.git']
    }, function(err) {
      err.should.be.instanceof(Array).and.have.lengthOf(1);
      done();
    });
  });
});
