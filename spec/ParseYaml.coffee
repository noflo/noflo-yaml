noflo = require 'noflo'
fs = require 'fs'
path = require 'path'
chai = require 'chai' unless chai
baseDir = path.resolve __dirname, '../'

describe 'ParseYaml component', ->
  c = null
  ins = null
  out = null
  before (done) ->
    loader = new noflo.ComponentLoader baseDir
    loader.load 'yaml/ParseYaml', (err, instance) ->
      return done err if err
      c = instance
      done()
  beforeEach ->
    ins = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    c.inPorts.in.attach ins
    c.outPorts.out.attach out
  afterEach ->
    c.inPorts.in.detach ins
    c.outPorts.out.detach out

  describe 'reading a simple YAML array', ->
    it 'should return the array', (done) ->
      out.once 'data', (data) ->
        chai.expect(data).to.eql [
          'one'
          'two'
          'three'
        ]
        done()
      ins.send """
- one
- two
- three
      """

  describe 'reading an empty string', ->
    it 'should return an empty object', (done) ->
      out.once 'data', (data) ->
        chai.expect(data).to.eql {}
        done()
      ins.send ''
