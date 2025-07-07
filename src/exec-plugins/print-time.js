const dayjs = require("dayjs");

function exec(client, config, command) {
  return '当前时间：' + dayjs().format("YYYY-MM-DD HH:mm:ss");
}

module.exports = {
  name: "print-time",
  exec,
};
