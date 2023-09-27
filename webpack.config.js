import webpack from "webpack";
import * as path from "node:path";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
import LicensePlugin from "webpack-license-plugin";

/**
 * @type {import('webpack').Configuration}
 */
export default {
  entry: {
    "unmangled-source-do-not-use-this": "./src/main.ts",
  },
  devtool: false,
  optimization: {
    minimize: false,
    // We do not want to replace "process.env.NODE_ENV" since we virtualize "process" itself
    nodeEnv: false,
  },
  output: {
    path: path.resolve("dist"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-typescript"],
        },
      },
    ],
  },
  resolve: {
    alias: {
      "node-gyp": false,
      "timers/promises": false,
      esbuild: false,
      "fs/promises": require.resolve("./src/shims/fs__promises.cjs"),
      fs: require.resolve("./src/shims/fs.cjs"),
      module: false,
      worker_threads: false,
      path: require.resolve("./src/shims/path.cjs"),
      inspector: false,
      process: require.resolve("./src/shims/process.cjs"),
      console: require.resolve("./src/shims/console.cjs"),
      os: require.resolve("./src/shims/os.cjs"),
      child_process: false,
      pnpapi: false,
      crypto: require.resolve("crypto-browserify"),
      util: require.resolve("npm-in-browser-shim-util"),
      zlib: require.resolve("browserify-zlib"),
      stream: require.resolve("stream-browserify"),
      buffer: require.resolve("npm-in-browser-shim-buffer"),
      http: require.resolve("./src/shims/http.cjs"),
      https: require.resolve("./src/shims/https.cjs"),
      assert: require.resolve("npm-in-browser-shim-assert"),
      querystring: require.resolve("querystring-es3"),
      vm: false,
      constants: require.resolve("constants-browserify"),
      url: require.resolve("./src/shims/url.cjs"),
      "make-fetch-happen": require.resolve("./src/shims/make-fetch-happen.cjs"),
      "uglify-js": false,
      "@swc/core": false,
      readline: false,
      tty: false,
      tls: false,
      dns: false,
      net: false,
    },
    fallback: {
      bluebird: false,
    },
    extensionAlias: {
      ".js": [".ts", ".tsx", ".js"],
    },
  },
  plugins: [
    new LicensePlugin.default({
      outputFilename: "third-party-licenses.json",
      unacceptableLicenseTest: (licenseIdentifier) => {
        // We use allow list to avoid accidentally vendoring sources with an incompatible license
        return ![
          "(MIT AND BSD-3-Clause)",
          "(MIT AND Zlib)",
          "Apache-2.0",
          "Artistic-2.0",
          "BSD-2-Clause",
          "BSD-3-Clause",
          "BlueOak-1.0.0",
          "CC-BY-3.0",
          "CC0-1.0",
          "ISC",
          "MIT",
        ].includes(licenseIdentifier);
      },
    }),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: ["process"],
      console: ["console"],
      setImmediate: [
        require.resolve("./src/shims/set-immediate.cjs"),
        "setImmediate",
      ],
      clearImmediate: [
        require.resolve("./src/shims/set-immediate.cjs"),
        "clearImmediate",
      ],
    }),
  ],
};
