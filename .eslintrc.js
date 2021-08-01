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
        // By pass Google's indentation & use 'eslint-recommended'
        'indent': 'off',
        'prefer-promise-reject-errors': ['error', {'allowEmptyReject': true}],
        'max-len': ['error', {'code': 120}],
        'padded-blocks': ['error', {'classes': 'always'}],
        'no-multiple-empty-lines': ['error', {max: 1, maxEOF: 0}],
    },
};
