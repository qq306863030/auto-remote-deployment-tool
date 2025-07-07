const { execServerCommand, logBlue, logRed, replacePath } = require("../tools");

async function exec(client, config, command) {
    const arr = command.split(",");
    for (let item of arr) {
        item = replacePath(config, 1, item)
        const res = await execServerCommand(client, `rm -rf ${item}`);
        if (!res) {
            logBlue(`删除完成 ${item}`)
        } else {
            logRed(`删除失败 ${item}`)
        }
    }
    return
}

module.exports = {
    name: "remote-rm",
    exec
}