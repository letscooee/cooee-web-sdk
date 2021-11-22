module.exports = {
    'env': {
        'browser': true,
        'es2021': true,
    },
    'extends': [
        'google',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        'ecmaVersion': 12,
        'sourceType': 'module',
    },
    'plugins': [
        '@typescript-eslint',
    ],
    'rules': {
        '@typescript-eslint/explicit-function-return-type': ['error', {
            allowExpressions: true,
            allowTypedFunctionExpressions: true,
            allowHigherOrderFunctions: true,
            allowDirectConstAssertionInArrowFunctions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: false,
        }],
        'require-jsdoc': ['off'],
        'valid-jsdoc': ['error', {
            requireParamType: false,
            requireParamDescription: false,
            requireReturnDescription: false,
            requireReturn: false,
            requireReturnType: false,
            prefer: {returns: 'return'},
        }],
        // By pass Google's indentation & use 'eslint-recommended'
        'indent': 'off',
        'space-before-function-paren': ['error', {
            'anonymous': 'always',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        'prefer-promise-reject-errors': ['error', {'allowEmptyReject': true}],
        'max-len': ['error', {'code': 120}],
        'padded-blocks': ['error', {'classes': 'always', 'blocks': 'never'}],
        'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 0}],
    },
};
