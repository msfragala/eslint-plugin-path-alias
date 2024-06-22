import { Rule } from "eslint";
import { dirname, resolve, basename } from "node:path";
import nanomatch from "nanomatch";
import { docsUrl } from "../utils/docs-url";
import { resolveAliases } from "../utils/resolve-aliases";

export const noRelative = {
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Ensure imports use path aliases whenever possible vs. relative paths",
      url: docsUrl("no-relative"),
    },
    fixable: "code",
    schema: [
      {
        type: "object",
        properties: {
          exceptions: {
            type: "array",
            items: {
              type: "string",
            },
          },
          paths: {
            type: "object",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      shouldUseAlias: "Import should use path alias instead of relative path",
    },
  },
  create(context) {
    const exceptions = context.options[0]?.exceptions;
    const filePath = context.filename;
    const aliases = resolveAliases(context);

    // If no aliases are found,
    // no rule listeners needed
    if (!aliases?.size) return {};

    return {
      ImportExpression(node) {
        if (node.source.type !== "Literal") return;
        if (typeof node.source.value !== "string") return;

        const raw = node.source.raw;
        const importPath = node.source.value;

        if (!/^(\.?\.\/)/.test(importPath)) {
          return;
        }

        const resolved = resolve(dirname(filePath), importPath);
        const excepted = matchExceptions(resolved, exceptions);

        if (excepted) return;

        const alias = matchToAlias(resolved, aliases);

        if (!alias) return;

        context.report({
          node,
          messageId: "shouldUseAlias",
          data: { alias },
          fix(fixer) {
            const aliased = insertAlias(resolved, alias, aliases.get(alias));
            const fixed = raw.replace(importPath, aliased);
            return fixer.replaceText(node.source, fixed);
          },
        });
      },
      ImportDeclaration(node) {
        if (typeof node.source.value !== "string") return;

        const importPath = node.source.value;

        if (!/^(\.?\.\/)/.test(importPath)) {
          return;
        }

        const resolved = resolve(dirname(filePath), importPath);
        const excepted = matchExceptions(resolved, exceptions);
        const alias = matchToAlias(resolved, aliases);

        if (excepted) return;
        if (!alias) return;

        context.report({
          node,
          messageId: "shouldUseAlias",
          data: { alias },
          fix(fixer) {
            const raw = node.source.raw;
            const aliased = insertAlias(resolved, alias, aliases.get(alias));
            const fixed = raw.replace(importPath, aliased);
            return fixer.replaceText(node.source, fixed);
          },
        });
      },
    };
  },
} satisfies Rule.RuleModule;

function matchToAlias(path: string, aliases: Map<string, string[]>) {
  return Array.from(aliases.keys()).find((alias) => {
    const paths = aliases.get(alias);
    return paths.some((aliasPath) => path.indexOf(aliasPath) === 0);
  });
}

function matchExceptions(path, exceptions) {
  if (!exceptions) return false;
  const filename = basename(path);
  const matches = nanomatch(filename, exceptions);
  return matches.includes(filename);
}

function insertAlias(path: string, alias: string, aliasPaths: string[]) {
  for (let aliasPath of aliasPaths) {
    if (path.indexOf(aliasPath) !== 0) continue;
    return path.replace(aliasPath, alias);
  }
}
