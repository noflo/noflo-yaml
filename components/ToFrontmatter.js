const noflo = require('noflo');

exports.getComponent = function () {
  const c = new noflo.Component();
  c.description = 'Join head and body to a Front Matter string';
  c.inPorts.add('head', {
    datatype: 'string',
    description: 'Header data in YAML format',
  });
  c.inPorts.add('body', {
    datatype: 'string',
    description: 'Body, typically in Markdown',
  });
  c.outPorts.add('out',
    { datatype: 'string' });

  c.forwardBrackets = { body: ['out'] };

  return c.process((input, output) => {
    if (!input.hasData('head', 'body')) { return; }
    const head = input.getData('head');
    const body = input.getData('body');
    output.sendDone({ out: `${head}\n---\n${body}` });
  });
};
