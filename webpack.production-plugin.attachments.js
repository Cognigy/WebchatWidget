const path = require("path");

const config = require("./webpack.production");

config.output.filename = "attachments.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/attachments/index.ts";

module.exports = config;
