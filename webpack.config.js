const path = require('path');
const HtmlWepackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const CleanWepackPlugin = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'bundle.[hash:4].js',
        path: path.resolve('dist')
    },
    devServer: {
        contentBase: './dist',
        port: 3000,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextWebpackPlugin.extract({
                    use: ['css-loader', 'postcss-loader'],
                    publicPath: '../'  //关于publicPath需要再细理解一下
                })
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024,
                            outputPath: 'image/'
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
            {
                test: /\.js$/,
                exclude: '/node_mudules/',
                use: 'babel-loader',
            }
        ]
    },
    plugins: [
        new HtmlWepackPlugin({
            template: 'public/index.html',
        }),
        new ExtractTextWebpackPlugin('css/style.css'),
        new CleanWepackPlugin()
    ]
}