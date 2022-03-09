const zlib = require("zlib");
const CompressionPlugin = require("compression-webpack-plugin");

/**
 * Updates a config to emit compressed file outputs
 * - emits brotli outputs (.br)
 * - emits gzip outputs (.gz)
 * 
 * used in production builds
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