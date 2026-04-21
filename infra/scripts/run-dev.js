const { spawn } = require("node:child_process");

spawn("next", ["dev"], {
  stdio: "inherit",
  shell: true,
});
var cleaning = false;
function cleanUp() {
  if (cleaning) return;

  spawn("npm", ["run", "services:stop"], {
    stdio: "inherit",
    shell: true,
  });
  process.exit(0);
}

process.on("SIGINT", cleanUp);
process.on("SIGTERM", cleanUp);
