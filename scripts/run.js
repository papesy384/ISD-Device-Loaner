#!/usr/bin/env node
/**
 * Run a command with npm_config_devdir unset to avoid "Unknown env config devdir" warning.
 * Usage: node scripts/run.js <cmd> [args...]
 * Example: node scripts/run.js run build
 */
delete process.env.npm_config_devdir;
const { spawnSync } = require("child_process");
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node scripts/run.js <cmd> [args...]");
  process.exit(1);
}
const result = spawnSync("npm", args, {
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
