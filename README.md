# npm-in-browser

Please help spread [the initial announcement X post](https://x.com/naruaway/status/1706984800081605062)!

Note: This was initially developed for [JS Bundle Lab](https://js-bundle-lab.nry.app)

npm-in-browser is a pure ESM npm package to **run npm CLI (e.g "npm install") in browser** without any 3rd party service, black box scripts, or heavy full-fledged Node.js emulation layer.
It "just" runs npm CLI and things like SharedArrayBuffer are not needed. It's easy to embed in any environments.

This is possible since [the official npm registry allows CORS](https://github.com/npm/feedback/discussions/117).

This repo includes a build script to compile the original source of [npm](https://github.com/npm/cli) by providing appropriate shims for Node.js specific things such as `process`. Since it instantiates this kind of globals for every `runNpmCli` run, most likely it does not pollute the global environment although there is no strict enforcement.

Probably the best way to use npm-in-browser in production is to run it inside Web Workers although it can run on the main thread just fine. Since we can instantiate `fs` (e.g. [memfs](https://github.com/streamich/memfs)) inside the worker, there is no need to run a dedicated "file system worker" as long as you are just interested in using that `fs` in the same worker for the subsequent processing such as "running Webpack in browser".

```typescript
import memfs from "memfs";
import { runNpmCli } from "npm-in-browser";

await runNpmCli(["install", "react", "react-dom"], {
  // Here we use memfs but anything compatible with Node.js fs can be used
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

// This should print the contents of package.json of react
console.log(
  memfs.fs.readFileSync("/home/web/app/node_modules/react/package.json"),
);
```

If you just want to play with it without any frontend bundlers, you can import packages from esm.sh like:

```html
<script type="module">
  import memfs from "https://esm.sh/memfs@4.5.0";
  import { runNpmCli } from "https://esm.sh/npm-in-browser@0.1.0";
  ...
</script>
```

For working examples using bundlers such as Vite, please check out [examples directory of this repo](examples). I also created [a demo using StackBlitz](https://stackblitz.com/edit/npm-in-browser-demo?file=src%2Fmain.tsx), which feels weird since StackBlitz itself can do "npm install" by itself via WebContainers.

Note that if you are fine with loading 3rd party non open source code from 3rd party host and there is no concern around commercial licensing, [WebContainers](https://webcontainers.io/) or [Nodebox](https://sandpack.codesandbox.io/docs/advanced-usage/nodebox) can be a better option. Since they use dedicated CDN for their services, loading performance can be better as well. Debugging, profiling, and tuning (customizing) could be easier with npm-in-browser though.

npm-in-browser is [distributed as a pure ESM npm package](https://www.npmjs.com/package/npm-in-browser).

## Runtime performance

We know that WebContainers / Nodebox are highly optimized in many ways. However, it turned out that both initial boot time and warm start up time is not so bad. You can see it by yourself.
Note that the performance of `fs` is **really** important here. For example, we found that "just using [memfs](https://github.com/streamich/memfs)" is really slow since it falls back to slower polyfill for [setImmediate](https://developer.mozilla.org/en-US/docs/Web/API/Window/setImmediate). You should use [setImmediate.js](https://github.com/YuzuJS/setImmediate) as a polyfill. Let us know if there are any easy-to-use high performance fs implementation for browser out-of-the-box.

## Benchmarks

You can check out [In-browser "npm install" benchmark](https://npm-install-browser-benchmark.nry.app), where we compare the performance of WebContainers, Nodebox, and npm-in-browser.

## Known issues

- Versioning. Currently npm-in-browser just ships the latest [npm](https://www.npmjs.com/package/npm).
- It does not send most of HTTP headers for the npm registry. If specific features of npm require these, it does not work.
- Running `runNpmCli` several times leaks some amount of memory. This can be mitigated by running it in Web Workers and terminate them appropriately.
- Since there is no runtime enforcement for the isolation, running `runNpmCli` could pollute some globals.
- The npm registry does not return CORS header appropriately for "404 Not Found" responses (e.g. `"https://registry.npmjs.org/abc-xyz-123456"`). Because of this, we cannot distinguish general fetch error and "not found" error. https://github.com/naruaway/npm-in-browser/issues/1

## License

npm-in-browser is [MIT licensed](./LICENSE).

As an npm package, it redistributes 3rd party sources under different licenses, which is listed under ./dist/third-party-licenses.json

Please file an issue if you find any potential license violations.
