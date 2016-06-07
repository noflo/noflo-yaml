noflo = require 'noflo'

exports.getComponent = ->
  c = new noflo.Component
  c.description = 'Join head and body to a Front Matter string'
  c.inPorts.add 'head',
    datatype: 'string'
    description: 'Header data in YAML format'
  c.inPorts.add 'body',
    datatype: 'string'
    description: 'Body, typically in Markdown'
  c.outPorts.add 'out',
    datatype: 'string'

  c.forwardBrackets =
    body: ['out']

  c.process (input, output) ->
    return unless input.has 'head', 'body'
    head = input.get 'head'
    until head.type is 'data'
      head = input.get 'head'
    body = input.get 'body'
    return unless body.type is 'data'
    output.sendDone
      out: "#{head.data}\n---\n#{body.data}"
