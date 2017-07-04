# tizen config loader for webpack [![Version](https://img.shields.io/npm/v/tizen-config-loader.svg)](https://www.npmjs.com/package/tizen-config-loader) [![Build Status](https://img.shields.io/travis/unindented/tizen-config-loader.svg)](https://travis-ci.org/unindented/tizen-config-loader)

Parses your Tizen `config.xml` file, loading your `<icon>` file, and respecting your `publicPath` configuration.

It also treats your config file as a `lodash` template, so you can interpolate variables or add any other logic you need.


## Installation

```sh
$ npm install --save tizen-config-loader
```


## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Say you are using [`html-webpack-plugin`](https://github.com/ampedandwired/html-webpack-plugin) for your Tizen project, and you want to add a config file. Your HTML template `template.ejs` could look like this:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <link rel="config" href="<%= require('./config.xml') %>" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

Your `config.xml` file could look like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<widget xmlns="http://www.w3.org/ns/widgets" xmlns:tizen="http://tizen.org/ns/widgets" id="<%= widgetId %>" version="<%= version %>" viewmodes="maximized">
  <tizen:application id="<%= packageId %>.<%= packageName %>" package="<%= packageId %>" required_version="2.3"/>
  <name><%= packageName %></name>
  <description><%= packageDescription %></description>
  <license href="https://opensource.org/licenses/<%= license %>"><%= license %></license>
  <author href="<%= author.url %>" email="<%= author.email %>"><%= author.name %></author>
  <icon src="./icon_117x117.png"/>
  <content src="index.html"/>
  <feature name="http://tizen.org/feature/screen.size.normal.1080.1920"/>
  <tizen:profile name="tv-samsung"/>
  <tizen:setting screen-orientation="landscape" context-menu="enable" background-support="disable" encryption="disable" install-location="auto" hwkey-event="enable"/>
</widget>
```

And your `webpack.config.js` file would glue everything together:

```js
var HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './index.js'
  },

  output: {
    path: './dist/',
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
            options: {
              name: 'foobar',
              description: 'Just an example.',
              version: '1.0.0',
              license: 'MIT',
              private: true,
              author: {
                name: 'Daniel Perez Alvarez',
                email: 'unindented@gmail.com',
                url: 'https://unindented.org/'
              },
              widgetId: 'https://github.com/unindented/tizen-config-loader',
              packageId: 'foobar',
              packageName: 'Foobar',
              packageDescription: 'An example of how to use this loader.',
            }
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
```

Running `webpack` would produce all the necessary files as expected:

```
$ npm run build

> foobar@1.0.0 build /Users/daniel/Code/tizen-config-loader/example
> webpack

Hash: 78a7179e776b6ec428af
Version: webpack 3.0.0
Time: 449ms
           Asset       Size  Chunks             Chunk Names
      config.xml  926 bytes          [emitted]
icon_117x117.png    0 bytes          [emitted]
          app.js     2.5 kB       0  [emitted]  app
      index.html  332 bytes          [emitted]
   [0] ./index.js 22 bytes {0} [built]
Child html-webpack-plugin for "index.html":
               Asset       Size  Chunks             Chunk Names
          config.xml  926 bytes          [emitted]
    icon_117x117.png    0 bytes          [emitted]
       [0] ./node_modules/html-webpack-plugin/lib/loader.js!./assets/template.ejs 767 bytes {0} [built]
       [2] (webpack)/buildin/global.js 509 bytes {0} [built]
       [3] (webpack)/buildin/module.js 517 bytes {0} [built]
       [4] ./assets/config.xml 56 bytes {0} [built]
       [5] ./assets/icon_117x117.png 62 bytes [built]
        + 1 hidden module
```

Go to the [`example` folder](/example) and try it yourself:

```
$ cd example
$ npm install
$ npm run build
```


## Meta

* Code: `git clone git://github.com/unindented/tizen-config-loader.git`
* Home: <https://github.com/unindented/tizen-config-loader/>


## Contributors

* Daniel Perez Alvarez ([unindented@gmail.com](mailto:unindented@gmail.com))


## License

Copyright (c) 2017 Daniel Perez Alvarez ([unindented.org](http://unindented.org/)). This is free software, and may be redistributed under the terms specified in the LICENSE file.
