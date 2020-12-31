const noflo = require('noflo');
const fs = require('fs');
const path = require('path');
const chai = require('chai');

const baseDir = path.resolve(__dirname, '../');

describe('ParseFrontmatter component', () => {
  let c = null;
  let ins = null;
  let filename = null;
  let out = null;
  let error = null;
  before(function () {
    this.timeout(10000);
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('yaml/ParseFrontmatter')
      .then((instance) => {
        c = instance;
        ins = noflo.internalSocket.createSocket();
        c.inPorts.content.attach(ins);
        return c.start();
      });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    filename = noflo.internalSocket.createSocket();
    error = noflo.internalSocket.createSocket();
    c.outPorts.results.attach(out);
    c.outPorts.filename.attach(filename);
    c.outPorts.error.attach(error);
  });
  afterEach(() => {
    c.outPorts.results.detach(out);
    c.outPorts.filename.detach(filename);
    c.outPorts.error.detach(error);
  });

  describe('Parsing a Front Matter file', () => it('should return the data with correct groups', (done) => {
    const groups = ['foo'];
    const receivedGroups = [];
    const filePath = `${__dirname}/fixtures/complex4.markdown`;
    error.on('data', done);
    out.on('begingroup', (group) => receivedGroups.push(group));
    out.once('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.path).to.equal(filePath);
      chai.expect(data.body).to.contain('Taking this further');
      chai.expect(receivedGroups).to.eql(groups);
      done();
    });

    groups.push(filePath);
    const fixture = fs.readFileSync(filePath, 'utf-8');
    ins.beginGroup('foo');
    ins.beginGroup(filePath);
    ins.send(fixture);
    ins.endGroup();
    ins.endGroup();
    ins.disconnect();
  }));

  describe('Parsing a file with pipe chars', () => it('should return an error with correct groups', (done) => {
    const groups = ['baz'];
    const receivedGroups = [];
    error.on('begingroup', (group) => receivedGroups.push(group));
    error.once('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.message).to.be.a('string');
      chai.expect(receivedGroups).to.eql(groups);
      done();
    });

    const filePath = `${__dirname}/fixtures/frontmatter_pipe.md`;
    groups.push(filePath);
    const fixture = fs.readFileSync(filePath, 'utf-8');
    ins.beginGroup('baz');
    ins.beginGroup(filePath);
    ins.send(fixture);
    ins.endGroup();
    ins.endGroup();
    ins.disconnect();
  }));
});
