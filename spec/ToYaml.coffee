noflo = require 'noflo'
fs = require 'fs'
path = require 'path'
chai = require 'chai' unless chai
baseDir = path.resolve __dirname, '../'

describe 'ToYaml component', ->
  c = null
  ins = null
  out = null
  before (done) ->
    loader = new noflo.ComponentLoader baseDir
    loader.load 'yaml/ToYaml', (err, instance) ->
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

  describe 'producing a simple YAML array', ->
    it 'should return the expected string', (done) ->
      out.once 'data', (data) ->
        chai.expect(data).to.equal '''
        ---
        - one
        - two
        - three
        ''' + "\n"
        done()
      ins.send [
        'one'
        'two'
        'three'
      ]

  describe 'producing YAML with problematic characters', ->
    it 'should return the expected string', (done) ->
      out.once 'data', (data) ->
        chai.expect(data).to.equal '''
        ---
        title: The Grid - an unconventional startup
        author:
          - name: Brian Axe
            url: 'https://medium.com/@brianaxe'
            avatar: {}
        ''' + "\n"
        done()
      ins.send
        title: "The Grid - an unconventional startup"
        author: [
          name: "Brian Axe"
          url: "https://medium.com/@brianaxe"
          avatar: {}
        ]
