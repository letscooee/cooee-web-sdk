// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const testCode = 'src/**/*.spec.ts';

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', 'webpack'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-junit-reporter'),
            require('karma-coverage'),
            require('karma-webpack'),
        ],
        files: [
            testCode,
        ],
        client: {
            jasmine: {
                // you can add configuration options for Jasmine here
                // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
                // for example, you can disable the random execution with `random: false`
                // or set a specific seed with `seed: 4321`
            },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        junitReporter: {
            outputDir: './tmp/test-reports',
            useBrowserName: true,
        },
        coverageReporter: {
            dir: require('path').join(__dirname, './tmp/coverage'),
            subdir: '.',
            reporters: [
                {type: 'html'},
                {type: 'cobertura'},
                {type: 'text-summary'}
            ]
        },
        preprocessors: {
            [testCode]: ['webpack'],
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: false,
        browsers: ['ChromeHeadlessNoSandbox'],
        customLaunchers: {
            // https://github.com/karma-runner/karma-chrome-launcher/issues/158#issuecomment-339265457
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox']
            }
        },
        singleRun: true,
        restartOnFileChange: true,
        webpack: {
            target: ['web'],
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
        },
    });

    if (process.env.GITLAB_CI) {
        process.env.CHROME_BIN = '/usr/bin/google-chrome-stable';
        console.log('ChromeHeadless path', process.env.CHROME_BIN);
        config.browsers = ['ChromeHeadlessNoSandbox'];

        config.reporters.push('junit');
    }
};
