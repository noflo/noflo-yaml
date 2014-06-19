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

  noflo.helpers.WirePattern c,
    in: ['in']
    out: 'out'
    forwardGroups: true
  , (data, groups, out) ->
    try
      result = parser.load data
    catch e
      c.error e
      return
    result = {} if result is null
    out.send result
  c
