const webpack = require("webpack");
const { version } = require('../package.json');

/**
 * Adds a banner comment with filename and version
 * used in production builds
 */
module.exports = (config) => ({
    ...config,
    plugins: [
        ...config.plugins,
        new webpack.BannerPlugin({
            banner: `[file] v${version}\nhttps://github.com/Cognigy/WebchatWidget/tree/v${version}`
        })
    ]
});