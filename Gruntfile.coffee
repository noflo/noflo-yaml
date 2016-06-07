module.exports = ->
  # Project configuration
  @initConfig
    pkg: @file.readJSON 'package.json'

    # BDD tests on Node.js
    mochaTest:
      nodejs:
        src: ['spec/*.coffee']
        options:
          reporter: 'spec'
          require: 'coffee-script/register'

    # Coding standards
    coffeelint:
      components:
        files:
          src: ['components/*.coffee']
        options:
          max_line_length:
            value: 80
            level: 'warn'
    noflo_lint:
      graphs:
        options:
          description: 'ignore'
          icon: 'ignore'
          port_descriptions: 'ignore'
          asynccomponent: 'error'
          wirepattern: 'warn'
          process_api: 'ignore'
          legacy_api: 'ignore'
        files:
          src: [
            'graphs/*.fbp'
          ]

  # Grunt plugins used for testing
  @loadNpmTasks 'grunt-mocha-test'
  @loadNpmTasks 'grunt-coffeelint'
  @loadNpmTasks 'grunt-noflo-lint'

  # Our local tasks
  @registerTask 'test', ['coffeelint', 'noflo_lint', 'mochaTest']
  @registerTask 'default', ['test']
