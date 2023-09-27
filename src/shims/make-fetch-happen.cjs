const makeFetchHappenShim = (url, options) => {
  if (typeof url !== "string" || !url.startsWith("https://")) {
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
            pipe(target) {
              const reader = rs.getReader();
              void (async () => {
                while (true) {
                  const ret = await reader.read();
                  if (ret.done) break;
                  target.write(ret.value);
                }
                target.end();
              })();
            },
          };
        } else {
          return val;
        }
      },
    });
  });
};

module.exports = makeFetchHappenShim;
