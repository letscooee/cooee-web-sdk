const path = require('path');

module.exports = {
    entry: './src/index.ts',
    target: ['web'],
    mode: 'production',
    devServer: {
        static: path.join(__dirname, 'apps', 'old-school'),
        devMiddleware: {
            publicPath: '/live-dist',
            writeToDisk: true,
        },
        open: ['/'],
        compress: true,
        hot: false,
        watchFiles: ['src/**/*.*', 'apps/old-school/*.*'],
        port: 8000,
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        publicPath: 'dist',
        library: {
            name: 'CooeeSDK',
            type: 'assign-properties',
            export: 'default',
        },
        chunkFormat: false,
        chunkLoading: false,
        filename: 'sdk.min.js',
        path: path.resolve(__dirname, 'dist'),
    },
};
