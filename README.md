# eslint-plugin-path-alias

Enforces usage of path aliases where available instead of relative paths. This helps ensure consistency in how modules are imported across your codebase.

## Installation

Using npm:

```
npm install --save-dev eslint-plugin-path-alias
```

Using pnpm:

```
pnpm add --save-dev eslint-plugin-path-alias
```

Using Yarn:

```
yarn add --dev eslint-plugin-path-alias
```

## Examples

Examples of **incorrect** code for this rule:

```js
// src/lib/speak.js

// With the following path aliases:
// - @/lib ➝ src/lib
// - @/constants ➝ src/constants

import foo from "./greet"; // Should use "@/lib"
import bar from "../constants/hello.i18n.js"; // Sould use "@/constants"
```

Examples of **correct** code for this rule:

```js
// src/lib/speak.js

// With the following path aliases:
// - @/lib ➝ src/lib
// - @/constants ➝ src/constants

import foo from "@/lib/greet";
import bar from "@/constants/hello.i18n.js";
import styles from "../styles/foo.css"; // No matching alias so this is okay
```

## Configuration

You can define your path aliases as options to the `path-alias/no-relative` rule:

```js
import pathAlias from 'eslint-plugin-path-alias';
import { resolve } from 'node:path';

export default [
  {
    plugins: {
      'path-alias': pathAlias,
    },
    rules: {
      'path-alias/no-relative': ['error', {
        paths: {
          // It's recommended to resolve path alias directories as
          // relative paths will be resolved relative to cwd. This
          // may cause unexpected behavior in monorepo setups
          '@': resolve(import.meta.dirname, './src'),
        },
      }],
    },
  },
];

```

### tsconfig.json

If no `paths` options is provided to the rule, this plugin will attempt to find the nearest `tsconfig.json` and infer path aliases from the [`paths` option](https://www.typescriptlang.org/tsconfig/#paths) there.

### package.json

If no paths are founded in either the rule or a `tsconfig.json`, this plugin will attempt to find the nearest `package.json` and infer path aliases from the [`imports` field](https://nodejs.org/api/packages.html#imports) there. For now, conditional imports are not supported

### `exceptions`

This option permits using relative paths to import sibling files that match a given pattern. This may be useful if you prefer relative paths for files that are collocated and tightly coupled — e.g. importing styles into a React component. Patterns are matched against the basenames and not full file paths. This option also only applies to files in the same directory, not ones in parent or descendent directories.

The `exceptions` options takes an array of [nanomatch](https://github.com/micromatch/nanomatch) globs:

```json
{
  "rules": {
    "path-alias/no-relative": [
      "error",
      {
        "exceptions": ["*.module.css"]
      }
    ]
  }
}
```

Examples of **correct** code with the settings above:

```js
// In src/components/Button.js
// Path alias: @/components ➝ src/components
import foo from "@/components/Text";
import styles from "./Button.module.css";
// Or you can still use an alias
import styles from "@/components/Button.module.css";
```

## Notes
- Does not validate imports using path aliases. Try using `import/no-unresolved` from [eslint-plugin-import](https://github.com/import-js/eslint-plugin-import) for that
- Does not work with CommonJS imports via `require()`
