readenv = require "../components/ExtractFrontmatter"
socket = require('noflo').internalSocket
fs = require 'fs'

setupComponent = ->
  c = readenv.getComponent()
  ins = socket.createSocket()
  out = socket.createSocket()
  c.inPorts.in.attach ins
  c.outPorts.out.attach out
  [c, ins, out]

exports['test reading a Front Matter file'] = (test) ->
  test.expect 3
  [c, ins, out] = setupComponent()
  out.once 'data', (data) ->
    test.ok data
    test.equal data.head, "\nfoo: bar\n"
    test.equal data.body, "hello\n"
    test.done()

  fixture = fs.readFileSync "#{__dirname}/fixtures/frontmatter.txt", 'utf-8'
  ins.send fixture

exports['test reading a regular file'] = (test) ->
  test.expect 3
  [c, ins, out] = setupComponent()
  out.once 'data', (data) ->
    test.ok data
    test.equal data.head, ''
    test.equal data.body, "hello\n"
    test.done()

  fixture = fs.readFileSync "#{__dirname}/fixtures/regular.txt", 'utf-8'
  ins.send fixture

exports['test reading a complex file'] = (test) ->
  test.expect 4
  [c, ins, out] = setupComponent()
  out.once 'data', (data) ->
    test.ok data
    test.ok data.head
    test.notEqual data.head.indexOf('location: Berlin, Germany'), -1
    test.ok data.body
    test.done()

  fixture = fs.readFileSync "#{__dirname}/fixtures/complex.md", 'utf-8'
  ins.send fixture

exports['test reading a messy file'] = (test) ->
  test.expect 4
  [c, ins, out] = setupComponent()
  out.once 'data', (data) ->
    test.ok data
    test.ok data.head
    test.notEqual data.head.indexOf('layout: "post"'), -1
    test.ok data.body
    test.done()

  fixture = fs.readFileSync "#{__dirname}/fixtures/complex2.html", 'utf-8'
  ins.send fixture
