noflo = require 'noflo'
fs = require 'fs'
path = require 'path'
chai = require 'chai' unless chai
baseDir = path.resolve __dirname, '../'

describe 'ExtractFrontmatter component', ->
  c = null
  ins = null
  out = null
  before (done) ->
    loader = new noflo.ComponentLoader baseDir
    loader.load 'yaml/ExtractFrontmatter', (err, instance) ->
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

  describe 'reading a Front Matter file', ->
    it 'should find head and body', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.head).to.equal "\nfoo: bar"
        chai.expect(data.body).to.equal "hello\n"
        done()

      fixture = fs.readFileSync "#{__dirname}/fixtures/frontmatter.txt", 'utf-8'
      ins.send fixture

  describe 'reading empty Front Matter', ->
    it 'should find head and body', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.head).to.equal ""
        chai.expect(data.body).to.equal "hello\n"
        done()

      fixture = fs.readFileSync "#{__dirname}/fixtures/empty_frontmatter.txt", 'utf-8'
      ins.send fixture

  describe 'reading a regular file', ->
    it 'should find head and body', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.head).to.equal ""
        chai.expect(data.body).to.equal "hello\n"
        done()

      fixture = fs.readFileSync "#{__dirname}/fixtures/regular.txt", 'utf-8'
      ins.send fixture

  describe 'reading a complex file', ->
    it 'should find head and body', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.head).to.contain 'location: Berlin, Germany'
        chai.expect(data.body).to.not.be.empty
        done()

      fixture = fs.readFileSync "#{__dirname}/fixtures/complex.md", 'utf-8'
      ins.send fixture

  describe 'reading a messy file', ->
    it 'should find head and body', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.head).to.contain 'layout: "post"'
        chai.expect(data.body).to.not.be.empty
        done()

      fixture = fs.readFileSync "#{__dirname}/fixtures/complex2.html", 'utf-8'
      ins.send fixture

  describe 'reading Markdown with subheadlines', ->
    it 'should find head and body', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.head).to.contain 'layout: "post"'
        chai.expect(data.body).to.contain 'Welcome'
        done()

      fixture = fs.readFileSync "#{__dirname}/fixtures/complex3.markdown", 'utf-8'
      ins.send fixture

  describe 'reading Markdown with inline HTML', ->
    it 'should find head and body', (done) ->
      out.on 'data', (data) ->
        chai.expect(data).to.be.an 'object'
        chai.expect(data.head).to.contain 'layout: post'
        chai.expect(data.body).to.contain 'Full-Stack'
        done()

      fixture = fs.readFileSync "#{__dirname}/fixtures/complex4.markdown", 'utf-8'
      ins.send fixture
