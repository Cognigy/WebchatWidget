const path = require("path");

const config = require("./webpack.production.legacy");

config.output.filename = "date-picker.webchat-plugin.legacy.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/date-picker/index.tsx";

config.target = ['web', 'es5'];

module.exports = config;
