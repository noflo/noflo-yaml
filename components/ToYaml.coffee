noflo = require 'noflo'
parser = require 'json2yaml'

class ToYaml extends noflo.Component
  constructor: ->
    @inPorts = new noflo.InPorts
      in:
        datatype: 'object'
        description: 'Object to YAMLify'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'string'

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group
    @inPorts.in.on "data", (data) =>
      @outPorts.out.send parser.stringify data
    @inPorts.in.on 'endgroup', =>
      @outPorts.out.endGroup()
    @inPorts.in.on "disconnect", =>
      @outPorts.out.disconnect()

exports.getComponent = -> new ToYaml
