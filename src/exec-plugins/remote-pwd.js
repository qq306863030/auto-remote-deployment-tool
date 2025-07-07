function exec(client, config, command) {
  return `当前远程基础路径为:${config.remoteBaseDir}`;
}

module.exports = {
  name: "remote-pwd",
  exec,
};
