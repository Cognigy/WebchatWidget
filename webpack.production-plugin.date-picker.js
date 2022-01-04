const path = require("path");

const config = require("./webpack.production");

config.output.filename = "date-picker.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/date-picker/index.tsx";

module.exports = config;
