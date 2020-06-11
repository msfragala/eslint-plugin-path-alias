const { dirname, resolve } = require('path');
const getAliasMap = require('../utils/get-alias-map');
const docUrl = require('../doc-url');

module.exports = {
	meta: {
		type: 'suggestion',
		docs: {
			description:
				'Ensure imports use path aliases whenever possible vs. relative paths',
			url: docUrl('no-relative'),
		},
		fixable: 'code',
		messages: {
			shouldUseAlias:
				'Import should use path alias instead of relative path',
		},
	},
	create(context) {
		const cwd = context.getCwd();
		const filePath = context.getFilename();
		const aliasMap = getAliasMap(context);

		return {
			ImportDeclaration(node) {
				const importPath = node.source.value;

				if (!/^(\.?\.\/)/.test(importPath)) {
					return;
				}

				const resolved = resolve(dirname(filePath), importPath);
				const alias = matchToAlias(resolved, aliasMap);

				if (alias) {
					context.report({
						node,
						messageId: 'shouldUseAlias',
						data: { alias },
						fix(fixer) {
							const raw = node.source.raw;
							const path = aliasMap[alias];
							const aliased = resolved.replace(path, alias);
							const fixed = raw.replace(importPath, aliased);
							return fixer.replaceText(node.source, fixed);
						},
					});
				}
			},
		};
	},
};

function matchToAlias(path, aliasMap) {
	return Object.keys(aliasMap).find((alias) => {
		const aliasPath = aliasMap[alias];
		return path.indexOf(aliasPath) === 0;
	});
}
