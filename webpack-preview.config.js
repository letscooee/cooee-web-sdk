const config = require('./webpack.config');
config.entry = './src/index-preview.ts';
config.output.library = {
    name: 'CooeePreview',
    type: 'assign',
    export: 'default',
};
config.output.filename = 'sdk-preview.min.js';
config.devServer.open = ['/index-preview.html']

module.exports = config;
