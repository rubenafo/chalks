import * as esbuild from "esbuild"

const shared = {
  entryPoints: ["src/chalks.js"],
  bundle: true,
  format: "iife",
  globalName: "Chalks",
  platform: "browser",
  logLevel: "info",
  define: { global: "globalThis" },
}

await esbuild.build({
  ...shared,
  outfile: "dist/chalks.dev.js",
})

await esbuild.build({
  ...shared,
  outfile: "dist/chalks.min.js",
  minify: true,
})
