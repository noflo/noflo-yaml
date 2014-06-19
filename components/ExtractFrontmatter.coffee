noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Extract Front Matter parts from a string'
  c.inPorts.add 'in',
    datatype: 'string'
    description: 'Front matter source'
  c.outPorts.add 'out',
    datatype: 'object'

  noflo.helpers.WirePattern c,
    in: ['in']
    out: 'out'
    forwardGroups: true
  , (data, groups, out) ->
    matcher = ///
      [\n]*-{3}        # Front Matter block starts
      ([\w\W]*)        # YAML contents
      [\n]-{3}[\n]        # Front Matter block ends
      ([\w\W]*)*       # Body
      ///
    match = matcher.exec data
    unless match
      out.send
        head: ''
        body: data
      return
    out.send
      head: match[1]
      body: match[2]

  c
