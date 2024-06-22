const { resolve } = require("path");
const { RuleTester } = require("eslint");
const plugin = require("../../../dist/index.js").default;
const rule = plugin.rules["no-relative"];
const ruleTester = new RuleTester();

/**
 *
 * @param {import('eslint').RuleTester.ValidTestCase} options
 * @returns {import('eslint').RuleTester.ValidTestCase}
 */
function test(options) {
  return {
    ...options,
    filename: __filename,
    settings: {
      "import/resolver": {
        alias: [
          ["@/rules", "./tests/lib/rules"],
          ["@/package", "./package.json"],
        ],
      },
    },
  };
}

ruleTester.run("path-alias", rule, {
  valid: [
    test({ code: `import a from '@/rules/a'` }),
    test({ code: `import a from '../a'` }),
    test({ code: `import pkg from '@/package'` }),
    test({
      code: `import styles from './a.css'`,
      options: [{ exceptions: ["*.css"] }],
    }),
    test({
      code: `import styles from './a.module.css'`,
      options: [{ exceptions: ["*.module.css"] }],
    }),
    test({ code: `const a = import('@/rules/a')` }),
    test({ code: `const a = import('../a')` }),
    test({ code: `const pkg = import('@/package')` }),
    test({
      code: `const styles = import('./a.css')`,
      options: [{ exceptions: ["*.css"] }],
    }),
    test({
      code: `const styles = import('./a.module.css')`,
      options: [{ exceptions: ["*.module.css"] }],
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
    test({
      code: `const a = import('./a')`,
      output: `const a = import('@/rules/a')`,
      errors: [{ message: rule.meta.messages.shouldUseAlias }],
    }),
    test({
      code: `const pkg = import('../../../package.json')`,
      output: `const pkg = import('@/package')`,
      errors: [{ message: rule.meta.messages.shouldUseAlias }],
    }),
  ],
});
