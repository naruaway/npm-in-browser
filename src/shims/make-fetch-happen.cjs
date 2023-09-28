const makeFetchHappenShim = (url, options) => {
  if (typeof url !== "string" || !(url.startsWith("https://") || url.startsWith("http://"))) {
    throw new Error("makeFetchHappenShim failed: url is not valid");
  }
  return fetch(url).then((r) => {
    return new Proxy(r, {
      get(target, prop, receiver) {
        const val = target[prop];
        if (typeof val === "function") {
          return val.bind(target);
        } else if (prop === "body") {
          /** @type {ReadableStream} */
          const rs = val;

          return {
            on(eventName, handler) {
              // FIXME: we might need to handle events on `body` properly
            },
            pipe(dest) {
              const reader = rs.getReader();
              void (async () => {
                while (true) {
                  const ret = await reader.read();
                  if (ret.done) break;
                  dest.write(ret.value);
                }
                dest.end();
              })();
            },
          };
        } else if (prop === "buffer") {
          return async () => {
            const rs = target.body

            const reader = rs.getReader();
            const chunks = []
            while (true) {
              const ret = await reader.read();
              if (ret.done) break;
              chunks.push(ret.value);
            }
            return Buffer.concat(chunks)
          }
        } else if (prop === "headers") {
          val.raw = () => Object.fromEntries(Array.from(val.entries()).map(([k, v]) => [k, [v]]))
          return val
        } else {
          return val;
        }
      },
    });
  });
};

module.exports = makeFetchHappenShim;
