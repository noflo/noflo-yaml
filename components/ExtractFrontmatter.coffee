noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Extract Front Matter parts from a string'
  c.inPorts.add 'in',
    datatype: 'string'
    description: 'Front matter source'
  c.outPorts.add 'out',
    datatype: 'object'

  c.process (input, output) ->
    data = input.get 'in'
    return unless data.type is 'data'
    matcher = ///
      [\n]*-{3}        # Front Matter block starts
      ([\w\W]*)        # YAML contents
      [\n]-{3}[\n]        # Front Matter block ends
      ([\w\W]*)*       # Body
      ///
    match = matcher.exec data.data
    unless match
      output.sendDone
        out:
          head: ''
          body: data.data
      return
    output.sendDone
      out:
        head: match[1]
        body: match[2]
