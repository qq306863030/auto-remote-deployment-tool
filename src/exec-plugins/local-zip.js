const { replacePath, execLocalCommand } = require("../tools");

async function exec(client, config, command) {
    const arr = command.split(",");
    arr[0] = replacePath(config, 0, arr[0])
    arr[1] = replacePath(config, 0, arr[1])
    if (!arr[0].includes("\"")) {
        arr[0] = `"${arr[0]}"`
    }
    if (!arr[1].includes("\"")) {
        arr[1] = `"${arr[1]}"`
    }
    const res = execLocalCommand(`powershell -Command \"Compress-Archive -Path ${arr[0]} -DestinationPath ${arr[1]} -Force\"`);
    if (!res.stderr) {
        return `文件压缩完成 ${arr[0]} ${arr[1]}`
    } else {
        return `文件压缩失败 ${arr[0]} ${arr[1]}`
    }
}

module.exports = {
  name: 'local-zip',
  exec,
}
