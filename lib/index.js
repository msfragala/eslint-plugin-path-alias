const { name, version } = require("../package.json");

/**
 * @type {import('eslint').ESLint.Plugin}
 */
module.exports = {
  meta: {
    name,
    version,
  },
  rules: {
    "no-relative": require("./rules/no-relative"),
  },
};
