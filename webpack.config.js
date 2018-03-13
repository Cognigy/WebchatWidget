// webpack.config.js
// Configure CSS processing & injection
var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        // Webpack prefers an absolute path:
        path: path.resolve(__dirname, '../demos/generic-webchat-demo/public'),
		filename: 'cognigyWebChat.js',
		library: 'Cognigy'
	},
	plugins: [
		new webpack.ProvidePlugin({
		  $: "jquery",
		  jQuery: "jquery"
		}),
		new webpack.optimize.CommonsChunkPlugin({
			children: true, 
			minChunks: 6
		  })
	],
    module: {
		rules: [
				{
					// Uses regex to test for a file type - in this case, ends with `.css`
					test: /\.css$/,
					// Apply these loaders if test returns true
					use: ['style-loader/useable', 'css-loader']
				},
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
						presets: ['@babel/preset-env']
					}
				}
			}
		]
    }
}	