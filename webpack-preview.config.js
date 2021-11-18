const config = require('./webpack.config');
config.entry = './src/index-preview.ts';
config.output.library = {
    name: 'CooeePreview',
    type: 'assign',
    export: 'default',
};
config.output.filename = 'sdk-preview.min.js';

module.exports = config;
