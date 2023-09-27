const polyfill = require("./set-immediate-polyfill.cjs");

module.exports.setImmediate = polyfill.setImmediate;
module.exports.clearImmediate = polyfill.clearImmediate;
