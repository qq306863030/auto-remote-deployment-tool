const path = require("path");
const fs = require("fs-extra");
const { logRed } = require("../tools");

function exec(client, config, command) {
  if (command) {
    const localBaseDir = path.resolve(config.localBaseDir, command);
    // 检测路径是否存在
    if (!fs.pathExistsSync(localBaseDir)) {
      logRed(`路径不存在:${localBaseDir}`)
      throw new Error('路径不存在');
    }
    config.localBaseDir = localBaseDir;
    return `已设置当前本地基础路径为:${config.localBaseDir}`
  }
  return `路径未设置，当前路径为:${config.localBaseDir}`
}

module.exports = {
  name: "local-cd",
  exec
}