import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM build
  {
    entry: ['src/index.ts'],
    format: 'esm',
    outDir: 'dist/esm',
    target: 'es2022',
    sourcemap: true,
    minify: false,
    dts: true,
    clean: true,
  },
  // CJS build
  {
    entry: ['src/index.ts'],
    format: 'cjs',
    outDir: 'dist/cjs',
    target: 'es2022',
    sourcemap: true,
    minify: false,
    dts: true,
    clean: false,
  },
  // Browser build (minified ESM for CDN / unpkg)
  {
    entry: ['src/index.ts'],
    format: 'esm',
    outDir: 'dist/browser',
    target: 'es2018',
    sourcemap: true,
    minify: true,
    dts: false,
    clean: false,
  },
]);
