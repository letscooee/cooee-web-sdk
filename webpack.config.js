const path = require('path');

module.exports = {
    entry: './src/index.ts',
    target: ['web'],
    mode: 'production',
    devServer: {
        static: path.join(__dirname, 'apps', 'tester-app'),
        devMiddleware: {
            publicPath: '/live-dist',
            writeToDisk: true,
        },
        open: ['/index.html'],
        compress: true,
        hot: false,
        watchFiles: ['src/**/*.*', 'apps/tester-app/*.*'],
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
    performance: {
        maxAssetSize: (500 * 1000),
        maxEntrypointSize: (500 * 1000),
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
