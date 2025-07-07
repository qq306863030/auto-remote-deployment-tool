const path = require("path");
const inquirer = require('inquirer')
const {
  readConfig,
  connectServer,
  initConfig,
  preCommand,
  parseCommand,
  disconnectServer,
  getExecPlugins,
  loadPlugins,
  logBlue,
  logRed,
  logGreen,
  isNotEmpty
} = require("./tools");

function init(filename) {
  const prompt = inquirer.createPromptModule();
  const promptOpt = [
    {
      type: "input",
      name: "filename",
      message: "请输入配置文件的名称",
      default: "server.config.js"
    },
    {
      type: "input",
      name: "description",
      message: "请输入配置文件的描述",
      default: ""
    }
  ]
  if (filename) {
    promptOpt.shift();
  }
  prompt(promptOpt).then(answers => {
    initConfig(filename || answers.filename, answers.description);
  }).catch(error => {})
}

let lastRes = false; // 记录上一次命令的执行结果
let startTime = null; // 记录程序开始执行的时间
async function exec(filePath) {
  startTime = Date.now();
  // 读取配置文件
  const config = readConfig(filePath);
  config.startTime = Date.now();
  config.startTimeTip = ""
  if (config.description) {
    logGreen(config.description)
  }
  logGreen('程序开始执行...')
  // 加载exec-plugins目录中的所有js文件, 并执行require
  loadPlugins(path.resolve(__dirname, "exec-plugins"));
  // 连接服务器
  let client;
  if (config.host) {
    try {
      client = await connectServer(config);
    } catch (error) {
      logRed('服务端连接失败，请检查访问配置')
      return;
    }
  }
  // 读取命令
  const commandList = config.commands;
  // 解析执行命令
  await _exec(client, config, commandList)
  // 断开连接
  if (client) {
    disconnectServer(client)
  }
  if (config.isPrintTotalExecTime) {
    logGreen(`程序执行完毕, 共耗时${Date.now() - startTime}ms`)
  }
}

async function _exec(client, config, commandList = []) {
  for (let command of commandList) {
    if (typeof command === "string") {
      let commandStr = command;
      try {
        if (config.isPrintCurCommand) {
          logGreen(`当前正在执行命令: ${commandStr}`)
        }
        command = preCommand(config, command);
        command = parseCommand(command);
        const execPlugin = getExecPlugins(command[0]);
        if (execPlugin) {
          let res = await execPlugin(client, config, command[1], command[2]);
          if (typeof res === "boolean" && command[2].includes("isBoolInversion")) {
            res = !res;
          }
          lastRes = res;
          if (isNotEmpty(res) && config.isPrintResult && !command[2].includes("isNotPrint")) {
            if (typeof res === "string" && (res.includes("error") || res.includes("失败"))) {
              logRed(res)
            } else {
              logBlue(res)
            }
          }
        }
      } catch (error) {
        if (!command[2].includes("isSkipErr")) {
          throw error;
        } else {
          if (config.isPrintResult && !command[2].includes("isNotPrint")) {
            logRed(`命令${commandStr}执行失败, 已跳过该进程: ${error.message}`)
          }
        }
      }
    } else if (Array.isArray(command) && lastRes === true) {
      await _exec(client, config, command)
    }
  }
}

module.exports = {
  init,
  exec,
};
