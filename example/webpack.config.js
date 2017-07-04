const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const pkg = require('./package.json')

module.exports = {
  entry: {
    app: './index.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[name].js'
  },

  module: {
    rules: [
      {
        test: /config\.xml$/,
        include: /assets\//,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          },
          {
            loader: 'tizen-config-loader',
            options: pkg
          }
        ]
      },
      {
        test: /\.png$/,
        include: /assets\//,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlPlugin({
      title: 'Foobar',
      template: './assets/template.ejs'
    })
  ]
}
