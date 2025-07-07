const { logBlue } = require("../tools");

function exec(client, config, command) {
    logBlue(command);
}

module.exports = {
    name: "print",
    exec
}