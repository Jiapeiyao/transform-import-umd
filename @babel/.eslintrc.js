const fabric = require('@umijs/fabric');

const eslint = {
  ...fabric.eslint,
  parser: '@typescript-eslint/parser',
	parserOptions: {
    ...fabric.eslint.parserOptions,
		project: './tsconfig.json'
	},
};

module.exports = eslint;