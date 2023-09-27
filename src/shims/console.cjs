const console = globalThis.console;

module.exports = {
  log: (...args) => {
    if (args.length !== 1) {
      console.error(
        "npm-in-browser: console.log cannot handle multiple args for now",
        args,
      );
      return;
    }
    NPM_IN_BROWSER$STDOUT(args[0] + "\n");
  },
  error: (...args) => {
    if (args.length !== 1) {
      console.error(
        "npm-in-browser: console.error cannot handle multiple args for now",
        args,
      );
      return;
    }
    NPM_IN_BROWSER$STDERR(args[0] + "\n");
  },
  warn: (...args) => {
    if (args.length !== 1) {
      console.error(
        "npm-in-browser: console.warn cannot handle multiple args for now",
        args,
      );
      return;
    }
    NPM_IN_BROWSER$STDERR(args[0] + "\n");
  },
};
