const config = require("./webpack.dev");

config.entry = ["./src/message-renderer/embed.ts"];

module.exports = config;
