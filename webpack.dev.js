const config = require("./webpack.config");
const path = require("path");

config.entry = {
	webchat: "./src/webchat-embed/index.tsx",
};

config.devServer = {
	allowedHosts: "all",
	static: {
		directory: path.join(__dirname, "dist"),
	},
	port: 8787,
	hot: true,
};

config.output = {
	path: path.resolve(__dirname, "dist"),
	filename: "[name].js",
};

module.exports = config;
