const path = require("path");

const config = require("./webpack.production");

config.output.filename = "messenger.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/messenger/index.tsx";

module.exports = config;
