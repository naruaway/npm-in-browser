import memfs from "memfs";

import { runNpmCli } from "../../..";

await runNpmCli(["install", "react"], {
  fs: memfs.fs,
  cwd: "/home/web/app",
  stdout: (chunk) => {
    console.log("stdout", chunk);
  },
  stderr: (chunk) => {
    console.log("stderr", chunk);
  },
  timings: {
    start(name) {
      console.log("START: " + name);
    },
    end(name) {
      console.log("END: " + name);
    },
  },
});

const reactPkgJson = memfs.fs.readFileSync(
  "/home/web/app/node_modules/react/package.json",
  "utf-8",
);

console.log({ reactPkgJson });
