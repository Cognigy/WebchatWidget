const config = require('./webpack.config');
const path = require('path');

config.entry = {
    'webchat': './src/webchat-embed/index.tsx',
    'message-renderer': './src/message-renderer/embed.ts'
};

config.output = {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
};

module.exports = config;