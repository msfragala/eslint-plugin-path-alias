const { resolve } = require('path');
const { RuleTester } = require('eslint');
const rule = require('../../../lib/rules/no-relative');

const ruleTester = new RuleTester();

function test(options) {
	return Object.assign(
		{
			filename: __filename,
			settings: {
				'import/resolver': {
					alias: [['@/rules', './tests/lib/rules']],
				},
			},
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 6,
			},
		},
		options
	);
}

ruleTester.run('path-alias', rule, {
	valid: [
		test({ code: `import a from '@/rules/a'` }),
		test({ code: `import a from '../a'` }),
	],
	invalid: [
		test({
			code: `import a from './a'`,
			output: `import a from '@/rules/a'`,
			errors: [{ message: rule.meta.messages.shouldUseAlias }],
		}),
	],
});
