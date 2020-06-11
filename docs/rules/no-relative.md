# Disallow relative paths when an alias is available (path-alias/no-relative)

Enforces usage of path aliases where available instead of relative paths. This helps ensure consistency in how modules are imported across a codebase.

## Rule Details

Examples of **incorrect** code for this rule:

```js
// In src/lib/speak.js
// Path alias: @/lib ➝ src/lib
// Path alias: @/constants ➝ src/constants
import foo from './greet'; // This import could use "@/lib"
import bar from '../constants/hello.i18n.js'; // This import could use "@/constants"
```

Examples of **correct** code for this rule:

```js
// In src/lib/speak.js
// Path alias: @/lib ➝ src/lib
// Path alias: @/constants ➝ src/constants
import foo from '@/lib/greet';
import bar from '@/constants/hello.i18n.js';
import styles from '../styles/foo.css'; // There is no alias for "src/styles" so this is okay
```

## When Not To Use It

If you are using `require()` to import modules. This rule currently only supports ES modules.
