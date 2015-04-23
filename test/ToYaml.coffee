readenv = require "../components/ToYaml"
socket = require('noflo').internalSocket

setupComponent = ->
  c = readenv.getComponent()
  ins = socket.createSocket()
  out = socket.createSocket()
  c.inPorts.in.attach ins
  c.outPorts.out.attach out
  [c, ins, out]

exports['test producing simple YAML array'] = (test) ->
  test.expect 1
  [c, ins, out] = setupComponent()
  out.once 'data', (data) ->
    test.equals data, '''
    ---
    - one
    - two
    - three
    ''' + "\n"
    test.done()
  ins.send ['one', 'two', 'three']
exports['test producing YAML with problematic characters'] = (test) ->
  test.expect 1
  [c, ins, out] = setupComponent()
  out.once 'data', (data) ->
    test.equals data, '''
    ---
    title: The Grid - an unconventional startup
    author:
      - name: Brian Axe
        url: "https://medium.com/@brianaxe"
        avatar: {}
    ''' + "\n"
    test.done()
  ins.send
    title: "The Grid - an unconventional startup"
    author: [
      name: "Brian Axe"
      url: "https://medium.com/@brianaxe"
      avatar: {}
    ]
