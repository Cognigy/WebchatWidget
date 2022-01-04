const path = require("path");

const config = require("./webpack.production");

config.output.filename = "rating.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/rating/index.ts";

module.exports = config;
