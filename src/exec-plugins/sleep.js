const { logBlue } = require("../tools");

function exec(client, config, command) {
  return new Promise((resolve, reject) => {
    logBlue(`暂停 ${command} ms`)
    setTimeout(() => {
      resolve("");
    }, parseInt(command));
  });
}

module.exports = {
  name: "sleep",
  exec,
};
