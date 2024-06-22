const { resolve } = require("path");
const { RuleTester } = require("eslint");
const plugin = require("../../../dist/index.js").default;
const rule = plugin.rules["no-relative"];
const ruleTester = new RuleTester();

/**
 *
 * @param {import('eslint').RuleTester.ValidTestCase} config
 * @returns {import('eslint').RuleTester.ValidTestCase}
 */
function test(config) {
  const options = config.options?.[0] ?? {};
  return {
    ...config,
    filename: __filename,
  };
}

ruleTester.run("no-relative-with-imports", rule, {
  valid: [
    test({
      code: `import styles from './a.css'`,
      options: [{ exceptions: ["*.css"] }],
    }),
    test({
      code: `import styles from '../../a'`,
    }),
    test({
      code: `const styles = import('./a.css')`,
      options: [{ exceptions: ["*.css"] }],
    }),
    test({
      code: `const a = import('../../a')`,
      options: [{ exceptions: ["*.css"] }],
    }),
  ],
  invalid: [
    test({
      code: `import a from './a'`,
      output: `import a from '#imports/a'`,
      errors: [{ message: rule.meta.messages.shouldUseAlias }],
    }),
    test({
      code: `import b from '../b'`,
      output: `import b from '#tests/b'`,
      errors: [{ message: rule.meta.messages.shouldUseAlias }],
    }),
    test({
      code: `const a = import('./a')`,
      output: `const a = import('#imports/a')`,
      errors: [{ message: rule.meta.messages.shouldUseAlias }],
    }),
    test({
      code: `const b = import('../b')`,
      output: `const b = import('#tests/b')`,
      errors: [{ message: rule.meta.messages.shouldUseAlias }],
    }),
  ],
});
