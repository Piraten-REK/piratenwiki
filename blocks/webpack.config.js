const {resolve} = require('path');
const webpack = require('webpack');

const config = {
    entry: './app/index.js',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: 'development',
    watch: true,
    devtool: 'cheap-eval-source-map',
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    }
};

module.exports = config;