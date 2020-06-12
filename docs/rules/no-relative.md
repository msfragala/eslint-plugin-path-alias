# Disallow relative paths when an alias is available (path-alias/no-relative)

Enforces usage of path aliases where available instead of relative paths. This helps ensure consistency in how modules are imported across a codebase.

## Rule Details

Examples of **incorrect** code for this rule:

```js
// In src/lib/speak.js
// Path alias: @/lib ➝ src/lib
// Path alias: @/constants ➝ src/constants
import foo from "./greet"; // Should use "@/lib"
import bar from "../constants/hello.i18n.js"; // Sould use "@/constants"
```

Examples of **correct** code for this rule:

```js
// In src/lib/speak.js
// Path alias: @/lib ➝ src/lib
// Path alias: @/constants ➝ src/constants
import foo from "@/lib/greet";
import bar from "@/constants/hello.i18n.js";
import styles from "../styles/foo.css"; // No matching alias so this is okay
```

### Options

#### `exceptions`

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

## When Not To Use It

If you are using `require()` to import modules. This rule currently only supports ES modules.
