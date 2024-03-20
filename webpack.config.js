const path = require("path");

module.exports = {
	mode: "development",
	entry: ["./src/webchat-embed/index.tsx"],
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "webchat.js",
	},
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".json"],
	},
	node: {},
	// devtool: 'source-map',
	module: {
		rules: [
			{
				// Include sound files for message notification sound
				test: /\.(ogg|mp3|wav|mpe?g)$/i,
				use: [{ loader: "url-loader" }],
			},
			{
				// Include ts, tsx, js, and jsx files.
				test: /\.(ts|js)x?$/,
				loader: "babel-loader",
				options: {
					presets: ["@babel/typescript", "@babel/preset-react"],
					compact: false,
				},
			},
			{
				test: /\.css$/,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.svg$/,
				exclude: /node_modules/,
				use: {
					loader: "svg-react-loader",
				},
			},
		],
	},
	devServer: {
		port: 8787,
	},
	plugins: [],
};
