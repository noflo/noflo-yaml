const noflo = require('noflo');
const path = require('path');
const chai = require('chai');

const baseDir = path.resolve(__dirname, '../');

describe('ToFrontmatter component', () => {
  let c = null;
  let head = null;
  let body = null;
  let out = null;
  before(() => {
    const loader = new noflo.ComponentLoader(baseDir);
    return loader.load('yaml/ToFrontmatter')
      .then((instance) => {
        c = instance;
        head = noflo.internalSocket.createSocket();
        c.inPorts.head.attach(head);
        body = noflo.internalSocket.createSocket();
        c.inPorts.body.attach(body);
      });
  });
  beforeEach(() => {
    out = noflo.internalSocket.createSocket();
    c.outPorts.out.attach(out);
  });
  afterEach(() => c.outPorts.out.detach(out));

  describe('converting head and body to Frontmatter', () => it('should produce expected results', (done) => {
    const expected = [
      '< 1',
      'Hello\n---\nWorld',
      '>',
    ];
    const received = [];
    out.on('begingroup', (group) => received.push(`< ${group}`));
    out.on('data', (data) => received.push(data));
    out.on('endgroup', () => received.push('>'));
    out.on('disconnect', () => {
      chai.expect(received).to.eql(expected);
      done();
    });

    head.beginGroup(1);
    head.send('Hello');
    head.endGroup();
    head.disconnect();

    body.beginGroup(1);
    body.send('World');
    body.endGroup();
    body.disconnect();
  }));
});
