const path = require("path");

const config = require("./webpack.production.legacy");

config.output.filename = "rating-widget.webchat-plugin.legacy.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/rating-widget/index.tsx";

config.target = ['web', 'es5'];

module.exports = config;

