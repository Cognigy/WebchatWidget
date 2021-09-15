const config = require("./webpack.production");

config.entry = ["./src/message-renderer/embed.ts"];
config.output.filename = "message-renderer.js";

module.exports = config;
