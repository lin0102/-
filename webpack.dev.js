module.exports = {
    mode: 'development',
    output: {
        filename: 'js/[name].js',
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: './dist',
        port: 3000,
        hot: true,
        open: false,
        proxy: {
            '/api': "http://localhost:8000/"
        }
    },
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    }
                ]
            }
        ]
    },
}