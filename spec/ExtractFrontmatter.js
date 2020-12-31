const noflo = require('noflo');
const fs = require('fs');
const path = require('path');
const chai = require('chai');

const baseDir = path.resolve(__dirname, '../');

describe('ExtractFrontmatter component', () => {
  let c = null;
  let ins = null;
  let out = null;
  before(() => {
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('yaml/ExtractFrontmatter')
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

  describe('reading a Front Matter file', () => it('should find head and body', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.head).to.equal('\nfoo: bar');
      chai.expect(data.body).to.equal('hello\n');
      done();
    });

    const fixture = fs.readFileSync(`${__dirname}/fixtures/frontmatter.txt`, 'utf-8');
    ins.send(fixture);
  }));

  describe('reading empty Front Matter', () => it('should find head and body', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.head).to.equal('');
      chai.expect(data.body).to.equal('hello\n');
      done();
    });

    const fixture = fs.readFileSync(`${__dirname}/fixtures/empty_frontmatter.txt`, 'utf-8');
    ins.send(fixture);
  }));

  describe('reading a regular file', () => it('should find head and body', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.head).to.equal('');
      chai.expect(data.body).to.equal('hello\n');
      done();
    });

    const fixture = fs.readFileSync(`${__dirname}/fixtures/regular.txt`, 'utf-8');
    ins.send(fixture);
  }));

  describe('reading a complex file', () => it('should find head and body', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.head).to.contain('location: Berlin, Germany');
      chai.expect(data.body).to.include('This makes sense');
      done();
    });

    const fixture = fs.readFileSync(`${__dirname}/fixtures/complex.md`, 'utf-8');
    ins.send(fixture);
  }));

  describe('reading a messy file', () => it('should find head and body', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.head).to.contain('layout: "post"');
      chai.expect(data.body).to.include('The Authoring Interface System');
      done();
    });

    const fixture = fs.readFileSync(`${__dirname}/fixtures/complex2.html`, 'utf-8');
    ins.send(fixture);
  }));

  describe('reading Markdown with subheadlines', () => it('should find head and body', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.head).to.contain('layout: "post"');
      chai.expect(data.body).to.contain('Welcome');
      done();
    });

    const fixture = fs.readFileSync(`${__dirname}/fixtures/complex3.markdown`, 'utf-8');
    ins.send(fixture);
  }));

  describe('reading Markdown with inline HTML', () => it('should find head and body', (done) => {
    out.on('data', (data) => {
      chai.expect(data).to.be.an('object');
      chai.expect(data.head).to.contain('layout: post');
      chai.expect(data.body).to.contain('Full-Stack');
      done();
    });

    const fixture = fs.readFileSync(`${__dirname}/fixtures/complex4.markdown`, 'utf-8');
    ins.send(fixture);
  }));
});
