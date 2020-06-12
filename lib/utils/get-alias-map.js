const getIn = require("./get-in");
const { resolve } = require("path");

module.exports = function getAliasMap(context) {
  const rootPath = context.getCwd();
  const aliasSettings = getIn(context.settings, "import/resolver.alias");

  if (!aliasSettings) {
    return {};
  }

  const aliasMatrix = Array.isArray(aliasSettings)
    ? aliasSettings
    : aliasSettings.map;

  return aliasMatrix.reduce((aliasMap, [alias, path]) => {
    aliasMap[alias] = resolve(rootPath, path);

    return aliasMap;
  }, {});
};
