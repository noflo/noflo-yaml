noflo = require 'noflo'
fs = require 'fs'
path = require 'path'
chai = require 'chai' unless chai
baseDir = path.resolve __dirname, '../'

describe 'ToFrontmatter component', ->
  c = null
  head = null
  body = null
  out = null
  before (done) ->
    loader = new noflo.ComponentLoader baseDir
    loader.load 'yaml/ToFrontmatter', (err, instance) ->
      return done err if err
      c = instance
      head = noflo.internalSocket.createSocket()
      c.inPorts.head.attach head
      body = noflo.internalSocket.createSocket()
      c.inPorts.body.attach body
      done()
  beforeEach ->
    out = noflo.internalSocket.createSocket()
    c.outPorts.out.attach out
  afterEach ->
    c.outPorts.out.detach out

  describe 'converting head and body to Frontmatter', ->
    it 'should produce expected results', (done) ->
      expected = [
        '< 1'
        'Hello\n---\nWorld'
        '>'
      ]
      received = []
      out.on 'begingroup', (group) ->
        received.push "< #{group}"
      out.on 'data', (data) ->
        received.push data
      out.on 'endgroup', ->
        received.push '>'
      out.on 'disconnect', ->
        chai.expect(received).to.eql expected
        done()

      head.beginGroup 1
      head.send 'Hello'
      head.endGroup()
      head.disconnect()

      body.beginGroup 1
      body.send 'World'
      body.endGroup()
      body.disconnect()
