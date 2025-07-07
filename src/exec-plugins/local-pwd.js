function exec(client, config, command) {
  return `当前本地基础路径为:${config.localBaseDir}`
}

module.exports = {
  name: "local-pwd",
  exec
}