import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm } from "node:fs/promises";

globalThis.require = createRequire(import.meta.url);

const dir = path.dirname(fileURLToPath(import.meta.url));

async function buildAll() {
  const distDir = path.resolve(dir, "dist");
  await rm(distDir, { recursive: true, force: true });

  await esbuild({
    entryPoints: [path.resolve(dir, "src/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external: [
      "*.node", "sharp", "bcrypt", "argon2", "fsevents", "pg-native",
      "bufferutil", "utf-8-validate", "canvas", "lightningcss",
    ],
    sourcemap: "linked",
    plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
    banner: {
      js: `import { createRequire as __cr } from 'node:module';
import __bp from 'node:path';
import __bu from 'node:url';
globalThis.require = __cr(import.meta.url);
globalThis.__filename = __bu.fileURLToPath(import.meta.url);
globalThis.__dirname = __bp.dirname(globalThis.__filename);
`,
    },
  });

  console.log("Build complete.");
}

buildAll().catch((err) => { console.error(err); process.exit(1); });
