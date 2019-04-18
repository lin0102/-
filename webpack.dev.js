module.exports = {
    mode: 'development',
    output: {
        filename: 'js/[name].js',
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist',
        port: 3000,
        hot: true
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader'
                ]
            }
        ]
    },
    plugins: [
        
    ]
}