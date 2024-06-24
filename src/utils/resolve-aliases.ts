import { type Rule } from "eslint";
import { type TsConfigResult, getTsconfig } from "get-tsconfig";
import { resolve, dirname } from "node:path";
import findPkg from "find-pkg";
import { readFileSync } from "node:fs";

export function resolveAliases(
  context: Rule.RuleContext
): undefined | Map<string, string[]> {
  if (context.options[0]?.paths) {
    return resolveCustomPaths(context);
  }

  const filename = context.getFilename?.() ?? context.filename;
  const tsConfig = getTsconfig(filename);

  if (tsConfig?.config?.compilerOptions?.paths) {
    return resolveTsconfigPaths(tsConfig);
  }

  const path = findPkg.sync(dirname(filename));

  if (!path) return;

  const pkg = JSON.parse(readFileSync(path).toString());

  if (pkg?.imports) {
    return resolvePackageImports(pkg, path);
  }
}

function resolvePackageImports(pkg: any, pkgPath: string) {
  const aliases = new Map<string, string[]>();
  const imports = pkg.imports ?? {};
  const base = dirname(pkgPath);

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

    const cwd = context.getCwd?.() ?? context.cwd;
    const resolved = resolve(cwd, path);
    aliases.set(alias, [resolved]);
  });

  return aliases;
}
