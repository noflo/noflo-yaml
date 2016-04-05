noflo = require 'noflo'
fs = require 'fs'
path = require 'path'
chai = require 'chai' unless chai
baseDir = path.resolve __dirname, '../'

describe 'ParseFrontmatter component', ->
  c = null
  ins = null
  filename = null
  out = null
  error = null
  before (done) ->
    loader = new noflo.ComponentLoader baseDir
    loader.load 'yaml/ParseFrontmatter', (err, instance) ->
      return done err if err
      c = instance
      c.once 'ready', ->
        c.start()
        c.network.on 'process-error', (e) ->
          setTimeout ->
            throw e.error
          , 0
        done()
  beforeEach ->
    ins = noflo.internalSocket.createSocket()
    out = noflo.internalSocket.createSocket()
    filename = noflo.internalSocket.createSocket()
    error = noflo.internalSocket.createSocket()
    c.inPorts.content.attach ins
    c.outPorts.results.attach out
    c.outPorts.filename.attach filename
    c.outPorts.error.attach error
  afterEach ->
    c.inPorts.content.detach ins
    c.outPorts.results.detach out
    c.outPorts.filename.detach filename
    c.outPorts.error.detach error

  describe 'Parsing a Front Matter file', ->
    it 'should return the data with correct groups', (done) ->
      groups = ['foo']
      receivedGroups = []
      error.on 'data', done
      out.on 'begingroup', (group) ->
        receivedGroups.push group
      out.once 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.path).to.equal filePath
        chai.expect(data.body).to.contain 'Taking this further'
        chai.expect(receivedGroups).to.eql groups
        done()

      filePath = "#{__dirname}/fixtures/complex4.markdown"
      groups.push filePath
      fixture = fs.readFileSync filePath, 'utf-8'
      ins.beginGroup 'foo'
      ins.beginGroup filePath
      ins.send fixture
      ins.endGroup()
      ins.endGroup()

  describe 'Parsing a file with pipe chars', ->
    it 'should return an error with correct groups', (done) ->
      groups = ['baz']
      receivedGroups = []
      error.on 'begingroup', (group) ->
        receivedGroups.push group
      error.once 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.message).to.be.a 'string'
        chai.expect(receivedGroups).to.eql groups
        done()

      filePath = "#{__dirname}/fixtures/frontmatter_pipe.md"
      groups.push filePath
      fixture = fs.readFileSync filePath, 'utf-8'
      ins.beginGroup 'baz'
      ins.beginGroup filePath
      ins.send fixture
      ins.endGroup()
      ins.endGroup()
