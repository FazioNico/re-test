/**
* Server Webpack config v.0.1.3
*/
const path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ModuleConcatPlugin = require('webpack/lib/optimize/ModuleConcatenationPlugin');
const NodemonPlugin = require( 'nodemon-webpack-plugin' );

// import nodemon config object
const NodemonOptions = require('./server.nodemon.json')

// define server config
const SERVER_CONFIG = {
  entry_path: path.resolve(), // server entry folder
  entry_file: path.resolve()+'/src/index.ts', // server entry start file
  output: path.resolve()+'/platforms/server', // server output folder
}

// define common webpack config for "prod" and "dev" environment
const commonConfig = {
  entry: SERVER_CONFIG.entry_file,
  target: 'node',
  externals: [
    /^[a-z\-0-9]+$/ // Ignore node_modules folder
  ],
  output: {
      filename: 'index.js', // output file
      path: SERVER_CONFIG.output,
      libraryTarget: "commonjs",
  },
  resolve: {
      // Add in `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
      modules: [path.resolve('node_modules')]
  },
  watchOptions: {
    poll: 500,
    aggregateTimeout: 300,
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
};

// define function to return default loaders
function getProdLoaders() {
  return devConfig.module.loaders;
}

// define webpack devConfig options
const devConfig = {
    module: {
        loaders: [{
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            test: /\.tsx?$/,
            exclude:[
              path.resolve('node_modules'),
              './**/*.docs.ts'
            ],
            loader: 'awesome-typescript-loader',
            options: {
                configFileName: SERVER_CONFIG.entry_path+'/tsconfig.json',
                sourceMap: true
            },
        }]
    },
    plugins: [
      new NodemonPlugin(NodemonOptions)
    ]
};

// define webpack prodConfig options
const prodConfig = {
    module: {
      loaders: getProdLoaders()
    },
    plugins: [
      new UglifyJsPlugin({
        test: /\.js($|\?)/i,
        sourceMap: false,
        uglifyOptions: {
            compress: true
        }
      }),
      // new CopyWebpackPlugin([
      //   { from: SERVER_CONFIG.entry_path+'/package.json'},
      //   { from: SERVER_CONFIG.entry_path+'/ngrok.yml'},
      //   { from: SERVER_CONFIG.entry_path+'/pm2.config.json'},
      //   { from: SERVER_CONFIG.entry_path+'/.gitignore' },
      //   { from: SERVER_CONFIG.entry_path+'/README.md' },
      // ]),
      new webpack.optimize.ModuleConcatenationPlugin()
    ],
};

// define webpack testConfig options
const testConfig = {
    devtool: "inline-source-map",
    module: {
      rules: [{
          test: /\.tsx?$/,
          //include: path.resolve('server'),
          exclude: [
            path.resolve('node_modules'),
            path.resolve('tools'),
            "**/*.tmp",
          ],
          rules: [
            {
              exclude: /\.spec.ts?$/,
              enforce: 'post',
              loader: 'istanbul-instrumenter-loader',
              query: {
                  esModules: true
              }
            },
            {
              loader: 'awesome-typescript-loader',
              options: {
                  configFileName: SERVER_CONFIG.entry_path+'/tsconfig.json',
                  sourceMap: true
              }
          }]
      }]
    }
};
// export webpack config
module.exports = (env)=> {
  console.log('#################################################');
  switch (true) {
    case env.prod === true:
      console.log('[info] Webpack build mode ==> prod');
      return Object.assign({}, commonConfig, prodConfig);
    case env.dev === true:
      console.log('[info] Webpack build mode ==> dev');
      return Object.assign({}, commonConfig, devConfig)
    case env.test === true:
      console.log('[info] Webpack build mode ==> test');
      return Object.assign({}, commonConfig, testConfig);
  }
  console.log('[info] Webpack build mode ==> default dev');
  return Object.assign({}, commonConfig, devConfig);
}
