const path = require("path");

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