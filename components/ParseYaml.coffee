noflo = require 'noflo'
parser = require 'js-yaml'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Parse YAML to an object'
  c.inPorts.add 'in',
    datatype: 'string'
    description: 'YAML source'
  c.outPorts.add 'out',
    datatype: 'object'
  c.outPorts.add 'error',
    datatype: 'object'
    required: false

  brackets = []
  c.process (input, output) ->
    return unless input.hasData 'in'
    data = input.getData 'in'

    unless data
      output.sendDone
        out: {}
      return

    try
      result = parser.load data
    catch e
      output.sendDone e
      return

    result = {} if result is null

    output.sendDone
      out: result
