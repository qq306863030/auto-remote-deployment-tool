const { execLocalCommand } = require("../tools");
const path = require("path");

async function exec(client, config, command) {
  if (typeof command === "string") {
    command = `powershell -Command "cd \"${config.localBaseDir}\";${command}"`
    const res = await execLocalCommand(command);
    return res.stdout || (res.stderr && `error:${res.stderr}`) || "执行完成";
  }
  return execLocalCommand(command);
}

module.exports = {
  name: "local",
  exec
}