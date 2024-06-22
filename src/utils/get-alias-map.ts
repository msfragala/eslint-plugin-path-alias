import { Rule } from "eslint";
import { getIn } from "./get-in";
import { resolve } from "node:path";

export function getAliasMap(context: Rule.RuleContext) {
  const rootPath = context.cwd || context.getCwd();
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
}
