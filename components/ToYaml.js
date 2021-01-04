const noflo = require('noflo');
const parser = require('js-yaml');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Convert an object to YAML';
  c.inPorts.add('in', {
    datatype: 'object',
    description: 'Object to YAMLify',
  });
  c.outPorts.add('out',
    { datatype: 'string' });

  return c.process((input, output) => {
    if (!input.hasData('in')) { return; }
    const data = input.getData('in');
    const yaml = `---\n${parser.dump(data)}`;
    output.sendDone({ out: yaml });
  });
};
