import { defineConfig } from "tsup";

export default defineConfig([
  // ESM build
  {
    entry: ["src/index.ts"],
    format: "esm",
    outDir: "lib/esm",
    target: "es2022",
    sourcemap: true,
    minify: false,
    dts: false,
    clean: true,
  },
  // CJS build
  {
    entry: ["src/index.ts"],
    format: "cjs",
    outDir: "lib/cjs",
    target: "es2022",
    sourcemap: true,
    minify: false,
    dts: true,
    clean: false,
  },
  // Browser build (minified)
  {
    entry: ["src/index.ts"],
    format: "esm",
    outDir: "lib/browser",
    target: "es2018",
    sourcemap: true,
    minify: true,
    dts: false,
    clean: false,
    define: {
      "process.env.NODE_ENV": '"production"',
      process: "undefined",
    },
  },
]);
