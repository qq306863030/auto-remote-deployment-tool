function exec(client, config, command) {
  config.startTime = Date.now();
  config.startTimeTip = command;
  return "已记录当前时间";
}

module.exports = {
  name: "record-exec-time",
  exec,
};
