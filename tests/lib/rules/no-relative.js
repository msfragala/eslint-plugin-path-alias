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
					alias: [
						['@/rules', './tests/lib/rules'],
						['@/package', './package.json'],
					],
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
		test({ code: `import pkg from '@/package'` }),
		test({
			code: `import styles from './a.css'`,
			options: [{ exceptions: ['*.css'] }],
		}),
		test({
			code: `import styles from './a.module.css'`,
			options: [{ exceptions: ['*.module.css'] }],
		}),
	],
	invalid: [
		test({
			code: `import a from './a'`,
			output: `import a from '@/rules/a'`,
			errors: [{ message: rule.meta.messages.shouldUseAlias }],
		}),
		test({
			code: `import pkg from '../../../package.json'`,
			output: `import pkg from '@/package'`,
			errors: [{ message: rule.meta.messages.shouldUseAlias }],
		}),
	],
});
