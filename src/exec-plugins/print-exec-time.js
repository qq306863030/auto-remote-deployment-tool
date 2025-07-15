const { formatMS } = require("../tools");

function exec(client, config, command) {
    return `【${config.startTimeTip}】程序段执行时间:${formatMS(Date.now() - config.startTime)}`;
  }
  
  module.exports = {
    name: "print-exec-time",
    exec,
  };
  