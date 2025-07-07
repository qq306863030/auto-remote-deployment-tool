const { execLocalCommand } = require("../tools");

function exec(client, config, command) {
  return execLocalCommand(command);
}

module.exports = {
  name: "local",
  exec
}