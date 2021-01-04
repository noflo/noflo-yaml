const noflo = require('noflo');
const path = require('path');
const chai = require('chai');

/* eslint-disable
    no-irregular-whitespace
*/

const baseDir = path.resolve(__dirname, '../');

describe('ToYaml component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(() => {
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('yaml/ToYaml')
      .then((instance) => {
        c = instance;
      });
  });
  beforeEach(() => {
    ins = noflo.internalSocket.createSocket();
    out = noflo.internalSocket.createSocket();
    c.inPorts.in.attach(ins);
    c.outPorts.out.attach(out);
  });
  afterEach(() => {
    c.inPorts.in.detach(ins);
    c.outPorts.out.detach(out);
  });

  describe('producing a simple YAML array', () => it('should return the expected string', (done) => {
    out.once('data', (data) => {
      chai.expect(data).to.equal(`\
---
- one
- two
- three\

`);
      done();
    });
    ins.send([
      'one',
      'two',
      'three',
    ]);
  }));

  describe('producing YAML with problematic characters', () => it('should return the expected string', (done) => {
    out.once('data', (data) => {
      chai.expect(data).to.equal(`\
---
title: The Grid - an unconventional startup
author:
  - name: Brian Axe
    url: https://medium.com/@brianaxe
    avatar: {}\

`);
      done();
    });
    ins.send({
      title: 'The Grid - an unconventional startup',
      author: [{
        name: 'Brian Axe',
        url: 'https://medium.com/@brianaxe',
        avatar: {},
      },
      ],
    });
  }));
});
