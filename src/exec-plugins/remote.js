const { execServerCommand } = require("../tools");

function exec(client, config, command) {
    console.log('&&&&', command)
    return execServerCommand(client, command);
}

module.exports = {
    name: "remote",
    exec
}