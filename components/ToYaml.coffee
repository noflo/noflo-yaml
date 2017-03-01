noflo = require 'noflo'
parser = require 'js-yaml'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Convert an object to YAML'
  c.inPorts.add 'in',
    datatype: 'object'
    description: 'Object to YAMLify'
  c.outPorts.add 'out',
    datatype: 'string'

  c.process (input, output) ->
    return unless input.hasData 'in'
    data = input.getData 'in'
    yaml = '---\n' + parser.safeDump data
    output.sendDone
      out: yaml
