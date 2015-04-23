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

  noflo.helpers.WirePattern c,
    in: ['in']
    out: 'out'
    forwardGroups: true
  , (data, groups, out) ->
    out.send '---\n' + parser.safeDump data

  c
