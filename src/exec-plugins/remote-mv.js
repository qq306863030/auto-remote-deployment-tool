const { execServerCommand, replacePath } = require("../tools");

async function exec(client, config, command) {
    const arr = command.split(",");
    arr[0] = replacePath(config, 1, arr[0])
    arr[1] = replacePath(config, 1, arr[1])
    const res = await execServerCommand(client, `mv ${arr[0]} ${arr[1]}`);
    if (!res) {
        return `文件移动完成 ${arr[0]} ${arr[1]}`
    } else {
        return `文件移动失败 ${arr[0]} ${arr[1]}`
    }
}

module.exports = {
    name: "remote-mv",
    exec
}