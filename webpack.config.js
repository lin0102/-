const path = require('path');
const HtmlWepackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');

const commonConfig = {
    output: {
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: '/node_mudules/',
                use: 'babel-loader',
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-withimg-loader'
                    }
                ]
            },
        ]
    },
    plugins: [
        new HtmlWepackPlugin({
            template: 'public/index.html',
        }),
    ]
}

module.exports = (env) => {
    if(env && env.production) {
        return merge(commonConfig, prodConfig);
    } else {
        return merge(commonConfig, devConfig);
    }
}