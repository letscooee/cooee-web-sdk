const config = require('./webpack.config');
config.entry = './src/shopify/index.ts';
config.output.library = {
    name: 'CooeeShopify',
    type: 'assign',
    export: 'default',
};
config.output.filename = 'shopify-sdk.min.js';
config.devServer.open = ['/index.html']

module.exports = config;
