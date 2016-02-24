'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const backendConfig = {
    entry: {
        backend: './app/app.js',
        updateSchema: './scripts/updateSchema.js'
    },
    target: 'node',
    externals: [nodeExternals()],
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
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
    resolve: {
        extensions: ['', '.js', '.json'],
        root: [
            path.resolve('./app')
        ]
    },
    devtool: 'sourcemap'
};

module.exports = backendConfig;
