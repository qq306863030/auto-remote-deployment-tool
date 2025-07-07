const { execServerCommand } = require("../tools");

function exec(client, config, command) {
    return execServerCommand(client, command);
}

module.exports = {
    name: "remote",
    exec
}