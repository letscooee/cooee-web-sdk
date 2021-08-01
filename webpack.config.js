const path = require('path');

module.exports = {
    entry: './src/index.ts',
    target: 'es5',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        library: {
            name: 'CooeeSDK',
            type: 'assign-properties',
            export: 'default',
        },
        chunkFormat: false,
        chunkLoading: false,
        filename: 'sdk.min.js',
        path: path.resolve(__dirname, 'dist')
    }
};