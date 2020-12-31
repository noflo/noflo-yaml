const noflo = require('noflo');
const parser = require('js-yaml');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Parse YAML to an object';
  c.inPorts.add('in', {
    datatype: 'string',
    description: 'YAML source',
  });
  c.outPorts.add('out',
    { datatype: 'object' });
  c.outPorts.add('error', {
    datatype: 'object',
    required: false,
  });

  return c.process((input, output) => {
    if (!input.hasData('in')) { return; }
    const data = input.getData('in');

    if (!data) {
      output.sendDone({
        out: {},
      });
      return;
    }

    let result;
    try {
      result = parser.load(data);
    } catch (e) {
      output.sendDone(e);
      return;
    }

    output.sendDone({
      out: result || {},
    });
  });
};
