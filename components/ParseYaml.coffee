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
    data = input.get 'in'
    return unless data.type is 'data'

    unless data.data
      output.sendDone
        out: {}
      return

    try
      result = parser.load data.data
    catch e
      output.sendDone
        error: e
      return

    result = {} if result is null

    output.sendDone
      out: result
