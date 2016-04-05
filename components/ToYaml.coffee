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
    data = input.get 'in'
    return unless data.type is 'data'
    yaml = '---\n' + parser.safeDump data.data
    output.sendDone
      out: yaml
