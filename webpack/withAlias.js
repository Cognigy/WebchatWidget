const path = require("path");

/**
 * Adds aliasing for `react` used in webchat plugins
 */
module.exports = (config) => {
    config.resolve.alias.react = path.resolve(__dirname, "../alias/react");

    return config;
}