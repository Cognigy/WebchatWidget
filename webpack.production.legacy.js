const config = require('./webpack.production');

config.entry.unshift('whatwg-fetch', 'url-polyfill', 'idempotent-babel-polyfill');
config.output.filename = 'webchat.legacy.js';
config.module.rules.find(rule => rule.loader === 'babel-loader').options.presets.unshift('@babel/preset-env');

module.exports = config;