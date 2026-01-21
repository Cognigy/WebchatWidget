const path = require("path");

const config = require("./webpack.production");

config.output.filename = "rating-widget.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/rating-widget/index.tsx";

module.exports = config;
