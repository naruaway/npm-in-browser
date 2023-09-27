const { hrtime } = require("../hrtime.js");
const log = globalThis.console.log;

const createfakeStream = (onWrite) => {
  return {
    // https://nodejs.org/api/stream.html#writablewritechunk-encoding-callback
    write(chunk, a, b) {
      const cb = typeof a === "function" ? a : b;
      if (chunk.length > 0) {
        if (onWrite) {
          onWrite(chunk);
        } else {
          throw new Error("fake stream error");
        }
      }
      if (cb) cb();
    },
    isTTY: false,
  };
};

const EventEmitter = require("npm-in-browser-shim-events");

const processEventEmitter = new EventEmitter();

/** @type {import('../types.js').ProcessInitType} */
const { execPath, cwd, args, exit } = NPM_IN_BROWSER$PROCESS_PARAMS;

const process = {
  exit: (errorCode) => {
    processEventEmitter.emit("exit");
    exit(errorCode);
  },
  removeListener(...args) {
    return processEventEmitter.removeListener(...args);
  },
  umask() {},
  getMaxListeners() {
    return 100;
  },
  execPath,
  stdin: createfakeStream(),
  stdout: createfakeStream(NPM_IN_BROWSER$STDOUT),
  stderr: createfakeStream(NPM_IN_BROWSER$STDERR),
  argv: [execPath, ...args],
  on(...args) {
    return processEventEmitter.on(...args);
  },
  off(...args) {
    return processEventEmitter.off(...args);
  },
  emit(...args) {
    log("emit", args);
    if (NPM_IN_BROWSER$options.timings) {
      if (args[0] === "time") {
        NPM_IN_BROWSER$options.timings.start(args[1]);
      } else if (args[0] === "timeEnd") {
        NPM_IN_BROWSER$options.timings.end(args[1]);
      }
    }
    return processEventEmitter.emit(...args);
  },
  env: {},
  cwd: () => cwd,
  hrtime,
  version: "v20.5.1",
  nextTick: (f) => {
    queueMicrotask(f);
  },
  versions: {
    node: "20.5.1",
    acorn: "8.10.0",
    ada: "2.5.1",
    ares: "1.19.1",
    base64: "0.5.0",
    brotli: "1.0.9",
    cjs_module_lexer: "1.2.2",
    cldr: "43.1",
    icu: "73.2",
    llhttp: "8.1.1",
    modules: "115",
    napi: "9",
    nghttp2: "1.55.1",
    openssl: "3.1.2",
    simdutf: "3.2.14",
    tz: "2023c",
    undici: "5.22.1",
    unicode: "15.0",
    uv: "1.46.0",
    uvwasi: "0.0.18",
    v8: "11.3.244.8-node.10",
    zlib: "1.2.11",
  },
};

module.exports = process;
