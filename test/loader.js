const {readFileSync} = require('fs')
const {resolve} = require('path')

const loader = require('../index.js')
const fixture = readFileSync(resolve(__dirname, 'fixture.xml')).toString()
const expected = readFileSync(resolve(__dirname, 'expected.xml')).toString()

const mockContext = function (query, callback) {
  const result = {
    options: {
      output: {
        publicPath: 'http://localhost:3000/'
      }
    },

    dependencies: [],

    cacheable: function () {
    },

    async: function () {
      return callback
    },

    resolve: function (dirname, filename, cb) {
      cb(null, filename.replace(/^\.\//, ''))
    },

    addDependency: function (filename) {
      this.dependencies.push(filename)
    },

    loadModule: function (filename, cb) {
      cb(null, 'module.exports = __webpack_public_path__ + "' + filename + '";')
    }
  }

  if (query) {
    result.query = query
  }

  return result
}

module.exports.test = {

  'processes config': function (test) {
    const callback = function (err, result) {
      test.equal(err, null)
      test.equal(result.trim(), expected.trim())
      test.done()
    }
    const context = mockContext({
      name: 'foo',
      description: 'bar',
      version: '0.0.1',
      license: 'MIT',
      author: {
        name: 'Daniel Perez Alvarez',
        email: 'unindented@gmail.com',
        url: 'https://unindented.org/'
      },
      widgetId: 'https://github.com/unindented/foo',
      packageId: 'foo',
      packageName: 'Foo',
      packageDescription: 'Foo bar for your baz.'
    }, callback)
    loader.call(context, fixture)
    test.expect(2)
  }

}
