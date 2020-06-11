const { version } = require('../package.json');

module.exports = (ruleName) => {
	const repo = 'https://github/com/msfragala/eslint-plugin-path-alias';
	return `${repo}/blob/${version}/docs/rules/${ruleName}.md`;
};
