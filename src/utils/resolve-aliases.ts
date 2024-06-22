import { type Rule } from "eslint";
import { type TsConfigResult, getTsconfig } from "get-tsconfig";
import { resolve, dirname } from "node:path";
import { NormalizedReadResult, readPackageUpSync } from "read-package-up";

export function resolveAliases(
  context: Rule.RuleContext
): undefined | Map<string, string[]> {
  if (context.options[0]?.paths) {
    return resolveCustomPaths(context);
  }

  const tsConfig = getTsconfig(context.filename);

  if (tsConfig?.config?.compilerOptions?.paths) {
    return resolveTsconfigPaths(tsConfig);
  }

  const pkg = readPackageUpSync({ cwd: dirname(context.filename) });

  if (pkg?.packageJson?.imports) {
    return resolvePackageImports(pkg);
  }
}

function resolvePackageImports(pkg: NormalizedReadResult) {
  const aliases = new Map<string, string[]>();
  const imports = pkg.packageJson.imports ?? {};
  const base = dirname(pkg.path);

  Object.entries(imports).forEach(([alias, path]) => {
    if (!path) return;
    if (typeof path !== "string") return;
    const resolved = resolve(base, path);
    aliases.set(alias, [resolved]);
  });

  return aliases;
}

function resolveTsconfigPaths(config: TsConfigResult) {
  const aliases = new Map<string, string[]>();
  const paths = config?.config?.compilerOptions?.paths ?? {};
  let base = dirname(config.path);

  if (config.config.compilerOptions?.baseUrl) {
    base = resolve(dirname(config.path), config.config.compilerOptions.baseUrl);
  }

  Object.entries(paths).forEach(([alias, path]) => {
    alias = alias.replace(/\/\*$/, "");
    path = path.map((p) => resolve(base, p.replace(/\/\*$/, "")));
    aliases.set(alias, path);
  });

  return aliases;
}

function resolveCustomPaths(context: Rule.RuleContext) {
  const aliases = new Map<string, string[]>();
  const paths = context.options[0]?.paths ?? {};

  Object.entries(paths).forEach(([alias, path]) => {
    if (!path) return;
    if (typeof path !== "string") return;

    if (path.startsWith("/")) {
      aliases.set(alias, [path]);
      return;
    }

    const resolved = resolve(context.cwd, path);
    aliases.set(alias, [resolved]);
  });

  return aliases;
}
