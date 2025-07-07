const { execServerCommand, replacePath } = require("../tools");

async function exec(client, config, filePath) {
    try {
        filePath = replacePath(config, 1, filePath)
        await execServerCommand(client, `ls ${filePath}`);
        return true
    } catch (error) {
        return false
    }
}

module.exports = {
    name: "remote-hasPath",
    exec
}