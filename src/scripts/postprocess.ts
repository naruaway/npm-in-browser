import * as fs from "node:fs";

const filePath = "./dist/unmangled-source-do-not-use-this.js";
const code = fs.readFileSync(filePath, "utf-8");

fs.writeFileSync(
  filePath,
  `export const runNpmCli = (NPM_IN_BROWSER$args, NPM_IN_BROWSER$options) => new Promise((NPM_IN_BROWSER$resolve, NPM_IN_BROWSER$reject) => {
  const NPM_IN_BROWSER$FS = NPM_IN_BROWSER$options.fs;
  const NPM_IN_BROWSER$STDOUT = (chunk) => {
    NPM_IN_BROWSER$options.stdout(chunk)
  };
  const NPM_IN_BROWSER$STDERR = (chunk) => {
    NPM_IN_BROWSER$options.stderr(chunk)
  };
  const NPM_IN_BROWSER$PROCESS_PARAMS = {
    cwd: NPM_IN_BROWSER$options.cwd,
    env: {},
    execPath: '/path/to/node',
    args: ["npm", ...NPM_IN_BROWSER$args],
    exit: (exitCode) => {
      if (exitCode === 0) {
        NPM_IN_BROWSER$resolve()
      } else {
        NPM_IN_BROWSER$reject(new Error('npmRun failed with exit code ' + exitCode))
      }
    },
  };
  ${code}
});
`,
);
