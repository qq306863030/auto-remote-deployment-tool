const { execServerCommand } = require("../tools");

function exec(client, config, command) {
    if (typeof command === "string") {
        command = `cd ${config.remoteBaseDir};${command}`
    }
    return execServerCommand(client, command);
}

module.exports = {
    name: "remote",
    exec
}