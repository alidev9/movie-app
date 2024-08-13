const path = require('path');

module.exports = {
    entry: './view-src/index.js',
    output: {
        path: path.resolve(__dirname, 'view-dist'),
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
    devtool: 'source-map',
    devServer: {
        //serve static files in the 'public' directory from the path /assets/
        static: {
            directory: path.join(__dirname, 'public'),
            publicPath: '/assets'
        },
        compress: true,
        port: 9000,
        open: false
    },
};