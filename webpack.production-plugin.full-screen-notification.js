const path = require("path");

const config = require("./webpack.production");

config.output.filename = "full-screen-notification.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/full-screen-notification/index.tsx";

module.exports = config;
