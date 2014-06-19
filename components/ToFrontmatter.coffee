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

  noflo.helpers.WirePattern c,
    in: ['head', 'body']
    out: 'out'
    forwardGroups: true
  , (data, groups, out) ->
    out.send "#{data.head}\n---\n#{data.body}"
