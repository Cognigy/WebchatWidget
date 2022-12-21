const path = require("path");

const config = require("./webpack.production.legacy");

config.output.filename = "attachments.webchat-plugin.legacy.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/attachments/index.ts";

config.target = ['web', 'es5'];

module.exports = config;
