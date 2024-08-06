const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    //loading the babel transpiler on each JS/JSX file
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    //Generate an HTML file within which the bundled JS is loaded from
    plugins: [
        new HtmlWebpackPlugin({
            template: './dist/index.html',
        }),
    ],
    devServer: {
        //serve static files in the 'public' directory from the path /assets/
        static: {
            directory: path.join(__dirname, 'public'),
            publicPath: '/assets'
        },
        compress: true,
        port: 8080,
    },
};