const vm = require('vm')
const async = require('async')
const get = require('lodash.get')
const template = require('lodash.template')
const loaderUtils = require('loader-utils')
const {Parser, Builder} = require('xml2js')

function assign (target) {
  const to = Object(target)

  for (let i = 1, l = arguments.length; i < l; i++) {
    const source = arguments[i]

    if (source != null) {
      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          to[key] = source[key]
        }
      }
    }
  }

  return to
}

function getConfig (source, data, callback) {
  const processedSource = template(source)(data)
  const parser = new Parser()
  parser.parseString(processedSource, callback)
}

function formatConfig (config) {
  const builder = new Builder()
  return builder.buildObject(config)
}

function getTasks (loaderContext, options, config) {
  return options.resolve.reduce(function (memo, field) {
    const [value] = get(config, field)
    memo.push(resolveSrc.bind(null, loaderContext, options, value))
    return memo
  }, [])
}

function resolveSrc (loaderContext, options, field, callback) {
  const context = loaderContext.context
  const request = loaderUtils.urlToRequest(field.$.src)

  loaderContext.resolve(context, request, function (err, filename) {
    if (err) {
      return callback(err)
    }

    loaderContext.addDependency(filename)

    loaderContext.loadModule(filename, function (err, source) {
      if (err) {
        return callback(err)
      }

      field.$.src = runModule(source, filename, options.publicPath)

      callback()
    })
  })
}

function runModule (src, filename, publicPath) {
  const script = new vm.Script(src, {
    filename: filename,
    displayErrors: true
  })

  const sandbox = {
    module: {},
    __webpack_public_path__: publicPath || ''
  }

  script.runInNewContext(sandbox)

  return sandbox.module.exports.toString()
}

const defaults = {
  resolve: ['widget.icon']
}

module.exports = function (source, map) {
  this.cacheable && this.cacheable()
  const callback = this.async()

  const config = loaderUtils.getOptions(this)
  const options = assign({
    publicPath: this.options.output.publicPath
  }, defaults, config)

  try {
    getConfig(source, options, (err, config) => {
      if (err) {
        return callback(err)
      }

      const tasks = getTasks(this, options, config)

      async.parallel(tasks, function (err) {
        if (err) {
          return callback(err)
        }

        callback(null, formatConfig(config))
      })
    })
  } catch (err) {
    callback(err)
  }
}
