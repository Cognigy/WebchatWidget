const path = require("path");

const config = require("./webpack.production");

config.output.filename = "speech-output.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/speech-output/index.tsx";

module.exports = config;
