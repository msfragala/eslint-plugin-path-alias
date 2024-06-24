import esbuild from "esbuild";
import { resolve } from "node:path";
import pkg from "./package.json" assert { type: "json" };

/**
 * @type {import('esbuild').BuildOptions[]}
 */
const outputs = [
  {
    format: "esm",
    outfile: "./dist/index.mjs",
    target: "es2020",
  },
  {
    format: "cjs",
    outfile: "./dist/index.js",
    target: "es2020",
  },
];

outputs.forEach((output) => {
  esbuild.build({
    ...output,
    entryPoints: [resolve("./src/index.ts")],
    bundle: true,
    minify: true,
    platform: "node",
    external: ["eslint", "nanomatch", "get-tsconfig", "find-pkg"],
  });
});
