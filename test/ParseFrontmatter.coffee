fs = require 'fs'
path = require 'path'
noflo = require 'noflo'

setupComponent = (cb) ->
  baseDir = path.resolve __dirname, '../'
  loader = new noflo.ComponentLoader baseDir
  loader.load 'yaml/ParseFrontmatter', (instance) ->
    instance.once 'ready', ->
      ins = noflo.internalSocket.createSocket()
      out = noflo.internalSocket.createSocket()
      filename = noflo.internalSocket.createSocket()
      err = noflo.internalSocket.createSocket()
      try
        instance.inPorts.content.attach ins
        instance.outPorts.results.attach out
        instance.outPorts.filename.attach filename
        instance.outPorts.error.attach err
      catch e
        console.log e
      cb [instance, ins, out, filename, err]

exports['test parsing a Front Matter file'] = (test) ->
  test.expect 5
  setupComponent ([c, ins, out]) ->
    groups = ['foo']
    out.on 'begingroup', (group) ->
      test.equal group, groups.shift()
    out.once 'data', (data) ->
      test.ok data
      test.equal data.path, filePath
      test.ok data.body
      test.done()

    filePath = "#{__dirname}/fixtures/complex4.markdown"
    groups.push filePath
    fixture = fs.readFileSync filePath, 'utf-8'
    ins.beginGroup 'foo'
    ins.beginGroup filePath
    ins.send fixture
    ins.endGroup()
    ins.endGroup()

exports['test reading file with pipe chars'] = (test) ->
  test.expect 4
  setupComponent ([c, ins, out, filename, err]) ->
    groups = ['baz']
    err.on 'begingroup', (group) ->
      test.equal group, groups.shift()
    err.once 'data', (data) ->
      test.ok data
      test.ok data.message
      test.done()

    filePath = "#{__dirname}/fixtures/frontmatter_pipe.md"
    groups.push filePath
    fixture = fs.readFileSync filePath, 'utf-8'
    ins.beginGroup 'baz'
    ins.beginGroup filePath
    ins.send fixture
    ins.endGroup()
    ins.endGroup()
