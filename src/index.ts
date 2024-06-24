import type { ESLint } from "eslint";
import { name, version } from "../package.json";
import { noRelative } from "./rules/no-relative";

export default {
  name,
  version,
  meta: { name, version },
  rules: {
    "no-relative": noRelative,
  },
} satisfies ESLint.Plugin;
