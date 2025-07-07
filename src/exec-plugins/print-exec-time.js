function exec(client, config, command) {
    return `【${config.startTimeTip}】程序段执行时间:${Date.now() - config.startTime}ms`;
  }
  
  module.exports = {
    name: "print-exec-time",
    exec,
  };
  