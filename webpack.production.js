const webpack = require("webpack");
const { version } = require("./package.json");

const config = require("./webpack.config");

const TerserPlugin = require("terser-webpack-plugin");
const zlib = require("zlib");
const CompressionPlugin = require("compression-webpack-plugin");

config.mode = "production";
config.plugins.push(
	new webpack.BannerPlugin({
		banner: `[file] v${version}\nhttps://github.com/Cognigy/WebchatWidget/tree/v${version}\nhttps://github.com/Cognigy/WebchatWidget/tree/v${version}/OSS_LICENSES.txt`,
	}),
);

config.plugins.push(
	new CompressionPlugin({
		filename: "[path][base].gz",
		algorithm: "gzip",
		test: /\.(js|css|html|svg|ts|tsx)$/,
		threshold: 10240,
		minRatio: 0.8,
	}),
);

config.plugins.push(
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
	}),
);

config.plugins.push(
	new webpack.optimize.LimitChunkCountPlugin({
		maxChunks: 1,
	}),
);

config.optimization = {
	minimize: true,
	minimizer: [
		new TerserPlugin({
			extractComments: false,
		}),
	],
	usedExports: true,
};

module.exports = config;
