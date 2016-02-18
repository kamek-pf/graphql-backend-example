'use strict';

const path = require('path');
const webpack = require('webpack');
const fs = require('fs');

let nodeModules = {};

// Exclude binary assets from the backend bundle
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

const backendConfig = {
    entry: './src/app.js',
    target: 'node',
    externals: nodeModules,
    output: {
        path: path.join(__dirname, 'build/backend'),
        filename: 'backend.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
                presets: ['node5'],
                plugins: ['transform-object-rest-spread']
            }
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    },
    plugins: [
        new webpack.IgnorePlugin(/\.(css|less)$/),
        new webpack.BannerPlugin('require("source-map-support").install();', { raw: true, entryOnly: false })
    ],
    devtool: 'sourcemap'
};

module.exports = backendConfig;
