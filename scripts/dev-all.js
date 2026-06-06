import { spawn } from "node:child_process";

const commands = [
  {
    name: "server",
    command: process.execPath,
    args: ["--use-system-ca", "server/server.js"]
  },
  {
    name: "client",
    command: process.execPath,
    args: ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"]
  }
];

const children = commands.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: false
  });

  child.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.log(`${name} stopped with code ${code}`);
    }
  });

  return child;
});

function stopAll() {
  children.forEach((child) => child.kill());
}

process.on("SIGINT", stopAll);
process.on("SIGTERM", stopAll);
