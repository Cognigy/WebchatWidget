var path = require('path');

module.exports = {
    mode: 'development',
    entry: ['./src/webchat-embed/index.tsx'],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'webchat.js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },
    node: {
        Buffer: false
    },
    // devtool: 'source-map',
    module: {
        rules: [
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.(ts|js)x?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        "@babel/typescript",
                        "@babel/preset-react"
                    ],
                    plugins: [
                        "@babel/proposal-class-properties"
                    ]
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }, 
            {
                test: /\.svg$/,
                exclude: /node_modules/,
                use: {
                    loader: 'svg-react-loader'
                },
            }
        ],
    }
};