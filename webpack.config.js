var path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

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
    node: {},
    // devtool: 'source-map',
    module: {
        rules: [
            {
                // Include sound files for message notification sound
                test: /\.(ogg|mp3|wav|mpe?g)$/i,
                use: [{ loader: 'url-loader' }]
            },
            {
                // Include ts, tsx, js, and jsx files.
                test: /\.(ts|js)x?$/,
                loader: 'babel-loader',
                options: {
                    presets: [
                        "@babel/typescript",
                        "@babel/preset-react"
                    ],
                    plugins: [
                        "@babel/proposal-class-properties",
                        "@babel/plugin-proposal-nullish-coalescing-operator",
                        "@babel/plugin-proposal-optional-chaining"
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
    },
    plugins: [],
    devServer: {
        port: 8787
    },
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
		],
		usedExports: true,
	},
};