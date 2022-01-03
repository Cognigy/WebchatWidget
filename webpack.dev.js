const config = require('./webpack.config');
const path = require('path');

config.entry = {
    'webchat': './src/webchat-embed/index.tsx',
    'message-renderer': './src/message-renderer/embed.ts'
};

config.devServer = {
    allowedHosts: 'all',
    static: {
        directory: path.join(__dirname, 'dist'),
    },
};

config.output = {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
};

module.exports = config;