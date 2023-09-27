const pathBrowserify = require("path-browserify");

module.exports = {
  ...pathBrowserify,
  win32: pathBrowserify.posix,
};
