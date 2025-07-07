const { execServerCommand } = require("../tools");

async function exec(client, config, port) {
    const res = await execServerCommand(client, `netstat -tuln | grep ${port}`);
    return Boolean(res)
}

module.exports = {
    name: "remote-hasPort",
    exec
}