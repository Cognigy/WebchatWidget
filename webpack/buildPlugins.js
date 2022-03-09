const path = require("path");

/**
 * Modifies a "config" object to build a "plugin" file
 * - updates the filename
 * - adds the "react alias" to reuse react from the webchat
 */
module.exports = (config) => ({
    ...config,
    output: {
        ...config.output,
        filename: `${config.output.filename.slice(0, -3)}.webchat-plugin.js`
    },
    resolve: {
        ...config.resolve,
        alias: {
            ...config.resolve.alias,
            react: path.resolve(__dirname, "../alias/react")
        }
    }
});