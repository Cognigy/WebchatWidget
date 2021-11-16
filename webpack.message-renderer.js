const config = require("./webpack.dev");

config.entry = ["./src/message-renderer/embed.ts"];
config.output.filename = "message-renderer.js";

module.exports = config;
