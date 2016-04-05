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
    sendResult = (port, result) ->
      output.sendIP port, new noflo.IP 'openBracket', bracket for bracket in brackets
      output.sendIP port, result
      output.sendIP port, new noflo.IP 'closeBracket', bracket for bracket in brackets
      output.done()
      return

    data = input.get 'in'
    if data.type is 'openBracket'
      brackets.push data.data
      return
    if data.type is 'closeBracket'
      brackets.pop()
      return
    return unless data.type is 'data'

    return sendResult 'out', {} unless data.data

    try
      result = parser.load data.data
    catch e
      return sendResult 'error', e

    result = {} if result is null

    return sendResult 'out', result
