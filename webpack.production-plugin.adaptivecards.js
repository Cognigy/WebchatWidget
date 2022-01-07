const path = require("path");

const config = require("./webpack.production");

config.output.filename = "adaptivecards.webchat-plugin.js";

config.resolve.alias = {
	react: path.resolve(__dirname, "alias/react"),
};

config.entry = "./src/plugins/adaptivecards/index.tsx";

module.exports = config;
