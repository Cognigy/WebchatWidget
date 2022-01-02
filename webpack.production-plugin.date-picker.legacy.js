const path = require("path");

const config = require("./webpack.production.legacy");

config.output.filename = "date-picker.webchat-plugin.legacy.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

module.exports = config;
