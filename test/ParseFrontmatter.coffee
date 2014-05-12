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
      try
        instance.inPorts.content.attach ins
        instance.outPorts.results.attach out
        instance.outPorts.filename.attach filename
      catch e
        console.log e
      cb [instance, ins, out, filename]

exports['test parsing a Front Matter file'] = (test) ->
  test.expect 3
  setupComponent ([c, ins, out]) ->
    out.once 'data', (data) ->
      test.ok data
      test.equal data.path, filePath
      test.ok data.body
      test.done()

    filePath = "#{__dirname}/fixtures/complex4.markdown"
    fixture = fs.readFileSync filePath, 'utf-8'
    ins.beginGroup 'foo'
    ins.beginGroup filePath
    ins.send fixture
    ins.endGroup()
    ins.endGroup()
