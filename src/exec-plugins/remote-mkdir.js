const { execServerCommand, replacePath } = require("../tools");

async function exec(client, config, command) {
    command = replacePath(config, 1, command)
    const res = await execServerCommand(client, `mkdir -p ${command}`);
    if (!res) {
        return `目录创建完成 ${command}`
    } else {
        return `目录创建失败 ${command}`
    }
}

module.exports = {
    name: "remote-mkdir",
    exec
}