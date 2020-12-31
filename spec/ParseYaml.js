const noflo = require('noflo');
const path = require('path');
const chai = require('chai');

const baseDir = path.resolve(__dirname, '../');

describe('ParseYaml component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(() => {
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('yaml/ParseYaml')
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

  describe('reading a simple YAML array', () => it('should return the array', (done) => {
    out.once('data', (data) => {
      chai.expect(data).to.eql([
        'one',
        'two',
        'three',
      ]);
      done();
    });
    ins.send(`\
- one
- two
- three\
`);
    ins.disconnect();
  }));

  describe('reading an empty string', () => it('should return an empty object', (done) => {
    out.once('data', (data) => {
      chai.expect(data).to.eql({});
      done();
    });
    ins.send('');
    ins.disconnect();
  }));
});
