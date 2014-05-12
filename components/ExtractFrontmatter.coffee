noflo = require 'noflo'

class ExtractFrontmatter extends noflo.Component
  constructor: ->
    @inPorts = new noflo.InPorts
      in:
        datatype: 'string'
        description: 'Front matter source'
    @outPorts = new noflo.OutPorts
      out:
        datatype: 'object'

    @inPorts.in.on 'begingroup', (group) =>
      @outPorts.out.beginGroup group
    @inPorts.in.on 'data', (data) =>
      @extract data
    @inPorts.in.on 'endgroup', =>
      @outPorts.out.endGroup()
    @inPorts.in.on 'disconnect', =>
      @outPorts.out.disconnect()

  extract: (data) ->
    matcher = ///
      [\n]*-{3}        # Front Matter block starts
      ([\w\W]*)        # YAML contents
      [\n]-{3}[\n]        # Front Matter block ends
      ([\w\W]*)*       # Body
      ///
    match = matcher.exec data
    unless match
      @outPorts.out.send
        head: ''
        body: data
      return
    @outPorts.out.send
      head: match[1]
      body: match[2]

exports.getComponent = -> new ExtractFrontmatter
