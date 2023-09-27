const httpsShim = require("https-browserify");

module.exports = {
  ...httpsShim,
  Agent: function Agent() {},
};
