const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Extract Front Matter parts from a string';
  c.inPorts.add('in', {
    datatype: 'string',
    description: 'Front matter source',
  });
  c.outPorts.add('out',
    { datatype: 'object' });

  return c.process((input, output) => {
    if (!input.hasData('in')) { return; }
    const data = input.getData('in');
    // eslint-disable-next-line no-multi-str
    const matcher = new RegExp('\
[\\n]*-{3}\
([\\w\\W]*)\
[\\n]-{3}[\\n]\
([\\w\\W]*)*\
');
    const match = matcher.exec(data);
    if (!match) {
      output.sendDone({
        out: {
          head: '',
          body: data,
        },
      });
      return;
    }
    output.sendDone({
      out: {
        head: match[1],
        body: match[2],
      },
    });
  });
};
