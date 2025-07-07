const path = require("path");
const { logRed } = require("../tools");
const remoteHasPath = require("./remote-hasPath.js");

async function exec(client, config, command) {
  if (command) {
    let remoteBaseDir
    if (command.startsWith("/")) {
        remoteBaseDir = command;
    } else {
        remoteBaseDir = path.join(config.remoteBaseDir, command);
    }
    remoteBaseDir = remoteBaseDir.replace(/\\/g, "/");
    // 检测路径是否存在
    if (!await remoteHasPath.exec(client, config, remoteBaseDir)) {
      logRed(`路径不存在:${remoteBaseDir}`)
      throw new Error('路径不存在');
    }
    config.remoteBaseDir= remoteBaseDir;
    return `已设置当前远程基础路径为:${config.remoteBaseDir}`
  }
  return `路径未设置，当前路径为:${config.remoteBaseDir}`
}

module.exports = {
  name: "remote-cd",
  exec
}