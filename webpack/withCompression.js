const zlib = require("zlib");
const CompressionPlugin = require("compression-webpack-plugin");

/**
 * Adds .br and .gz variants of files in production
 */
module.exports = (config) => ({
    ...config,
    plugins: [
        ...config.plugins,
        new CompressionPlugin({
            filename: "[path][base].gz",
            algorithm: "gzip",
            test: /\.(js|css|html|svg|ts|tsx)$/,
            threshold: 10240,
            minRatio: 0.8,
        }),
        new CompressionPlugin({
            filename: "[path][base].br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg|ts|tsx)$/,
            compressionOptions: {
                params: {
                    [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
                },
            },
            threshold: 10240,
            minRatio: 0.8,
        })
    ]
});