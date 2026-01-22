const fs = require("fs-extra");
const path = require("path");
const shelljs = require("shelljs");
const { NodeSSH } = require("node-ssh");
const dayjs = require("dayjs");
const chalk = require("chalk");

let sftp;
let execPlugins = new Map();
const globalSetter = {
  config: null
}
// 初始化配置文件
function initConfig(filename, description="") {
  // 在执行命令的目录下创建server.config.json文件
  let configPath = path.resolve("./", filename || "server.config.js");
  // 判断文件是否存在
  if (fs.pathExistsSync(configPath)) {
    logRed("文件已存在");
    return;
  }
  const defaultConfigPath = path.resolve(__dirname, "./default/server.config.js");
  // 读取默认配置文件
  const defaultConfig = require(defaultConfigPath);
  defaultConfig.description = description;
  // 获取后缀名
  const extname = path.extname(configPath);
  if (extname === ".json") {
    defaultConfig.scriptCode = `rdt exec ./${filename}`
    // 写入配置文件
    fs.outputJsonSync(configPath, defaultConfig, { spaces: 2 });
  } else {
    if (extname !== ".js" && extname!== ".json") {
      filename = filename + '.js'
      configPath = configPath + '.js'
    }
    defaultConfig.scriptCode = `rdt exec ./${filename}`
    // 写入配置文件
    fs.outputFileSync(configPath, `module.exports = ${JSON.stringify(defaultConfig, null, 2)};`);
  }
}

// 读取执行命令目录下的配置文件
function readConfig(configPath) {
  if (!configPath) {
    configPath = path.resolve("./", "server.config.js");
  } else {
    configPath = path.resolve("./", configPath);
    // 判断是否是目录
    const isDir = fs.lstatSync(configPath).isDirectory();
    if (isDir) {
      configPath = path.resolve(configPath, "server.config.js");
    }
  }
  const isCheck = fs.pathExistsSync(configPath);
  if (!isCheck) {
    logRed("配置文件不存在，请先初始化配置文件");
    throw new Error("配置文件不存在，请先初始化配置文件");
  }
  let config;
  // 判断后缀名是.js还是.json
  const extname = path.extname(configPath);
  if (extname === ".js" || extname === ".cjs") {
    config = require(configPath);
  } else if (extname === ".json") {
    try {
      config = fs.readJsonSync(configPath);
    } catch (error) {
      // 转换路径中的斜杠
      config = fs.readFileSync(configPath, "utf8");
      config = config.replace(/\\/g, "/");
      config = JSON.parse(config);
    }
  }
  config.localBaseDir = path.resolve("./", config.localBaseDir);
  return config;
}

// 连接服务器
async function connectServer(clientConfig) {
  const client = new NodeSSH();
  await client.connect(clientConfig);
  sftp = await client.requestSFTP();
  const isConnected = client.isConnected();
  if (isConnected) {
    logGreen("服务器连接成功");
    return client;
  } else {
    logRed("服务器连接失败");
    throw new Error("服务器连接失败");
  }
}

// 断开服务器连接
function disconnectServer(client) {
  client.dispose();
}

// 文件上传
function uploadFile(config, client, filePath, remotePath, includeKeyWords=[], excludeKeyWords=[], isPrintUploadPath=false) {
  includeKeyWords = includeKeyWords.map(item => item.trim());
  excludeKeyWords = excludeKeyWords.map(item => item.trim());
  filePath = path.resolve(config.localBaseDir, filePath);
  // 判断是否存在
  if (!fs.pathExistsSync(filePath)) {
    logRed(filePath + "文件不存在, 上传失败!");
    return null;
  }
  // 判断是目录还是文件
  const isDir = fs.lstatSync(filePath).isDirectory();
  if (isDir) {
    // 上传目录
    return client.putDirectory(filePath, remotePath, {
      sftp,
      recursive: true,
      concurrency: 1,
      tick: (localPath, remotePath) => {
        if (isPrintUploadPath) {
          logBlue(`上传${localPath} => ${remotePath}`);
        }
      },
      validate: path => {
        let valid = true;
        // 判断是文件还是目录
        const isDirectory = fs.lstatSync(path).isDirectory();
        if (isDirectory) {
          return true;
        }
        if (includeKeyWords && excludeKeyWords && includeKeyWords.length > 0 && excludeKeyWords.length > 0) {
          const isInclude = includeKeyWords.some(str => {
            return path.includes(str)
          })
          const isExclude = excludeKeyWords.some(str => {
            return path.includes(str)
          })
          valid = isInclude && !isExclude
        }
        if (includeKeyWords && includeKeyWords.length > 0) {
          valid = includeKeyWords.some(str => {
            return path.includes(str)
          })
        }
        if (excludeKeyWords && excludeKeyWords.length > 0) {
          valid = !excludeKeyWords.some(str => {
            return path.includes(str)
          })
        }
        return valid;
      }
    });
  } else {
    if (isPrintUploadPath) {
      logBlue(`上传${filePath} => ${remotePath}`);
    }
    // 上传文件
    return client.putFile(filePath, remotePath, sftp);
  }
}

// 执行本地命令
async function execLocalCommand(command) {
  if (typeof command === "string") {
    return shelljs.exec(command, {
      encoding: "utf8",
      silent: true,
    });
  } else if (Array.isArray(command)) {
    let result = [];
    for (let i = 0; i < command.length; i++) {
      res = shelljs.exec(command[i]);
      result.push(res);
    }
    return result;
  }
}

// 执行服务器命令
async function execServerCommand(client, command) {
  if (typeof command === "string") {
    return client.exec(command, []);
  } else if (Array.isArray(command)) {
    let result = [];
    for (let i = 0; i < command.length; i++) {
      res = await client.exec(command[i], []);
      result.push(res);
    }
    return result;
  }
}

// 预处理用户命令
function preCommand(config, command) {
  // 替换命令中的变量
  if (command.includes("{localBaseDir}")) {
    command = command.replace(/\{localBaseDir\}/g, config.localBaseDir);
  }
  if (command.includes("{remoteBaseDir}")) {
    command = command.replace(/\{remoteBaseDir\}/g, config.remoteBaseDir);
  }
  // 解析命令中的变量 {time-format}(exp: {time-[YYYY-MM-DD HH:mm:ss]})
  const reg = /\{time-([^\}]+)\}/g;
  const matchArr = command.match(reg);
  if (matchArr) {
    for (let i = 0; i < matchArr.length; i++) {
      const match = matchArr[i];
      const format = match.replace("{time-[", "").replace("]}", "");
      command = command.replace(match, dayjs().format(format));
    }
  }
  const reg2 = /\{startTime-([^\}]+)\}/ig;
  const matchArr2 = command.match(reg2);
  if (matchArr2) {
    for (let i = 0; i < matchArr2.length; i++) {
      const match = matchArr2[i];
      const format = match.replace("{startTime-[", "").replace("]}", "");
      command = command.replace(match, dayjs(config.startTime).format(format));
    }
  }
  return command;
}

// 解析用户命令 [local(isNotPrint, isSkipErr):]command => [commandPrefix, command, commandArgs]
function parseCommand(command) {
  // 命令中包含[local:]、[remote:]、[upload:]等前缀，中括号中匹配任意字符加冒号, 将命令和前缀分开
  const reg = /^(\[.*:\])(.*)/;
  const matchArr = command.match(reg);
  let res = []
  if (!matchArr) {
    res = ["[remote:]", command];
  } else {
    res = [matchArr[1], matchArr[2]];
  }
  // 解析类似[local:]中的字符串
  const reg2 = /\[(.*):]/;
  const matchArr2 = res[0].match(reg2);
  const res2 = _parseArgs(matchArr2[1])
  return [res2[0], res[1], res2[1]];
}

// 解析命令中的参数
function _parseArgs(command) {
  // 命令中包含local(isNotPrint, isSkipErr), remote(isNotPrint, isSkipErr), upload(isNotPrint, isSkipErr)等参数，逗号分隔, 将参数和命令分开
  const reg = /(.*)\((.*)\)(.*)/;
  const matchArr = command.match(reg);
  let res = [];
  if (!matchArr) {
    res = [command, []];
  } else {
    const command = matchArr[1];
    const argsStr = matchArr[2];
    const argsArr = argsStr.split(",").map((item) => item.trim());
    res = [command, argsArr];
  }
  return res;
}

// 获取版本
function getVersion() {
  const packagePath = path.resolve(__dirname, "../package.json");
  const package = fs.readJsonSync(packagePath);
  return package.version;
}

function logBlue(msg) {
  console.log(chalk.hex("#6dd2ea")(`${getCurrentTime()}${msg}`));
}

function logGreen(msg) {
  console.log(chalk.hex("#9bed7f")(`${getCurrentTime()}${msg}`));
}

function logRed(msg) {
  console.log(chalk.hex("#ed7f7f")(`${getCurrentTime()}${msg}`));
}

// 注册插件
function setExecPlugins(commandName, plugin) {
  execPlugins.set(commandName, plugin);
}

// 获取插件
function getExecPlugins(commandName) {
  return execPlugins.get(commandName);
}

// 加载目录下的插件
function loadPlugins(dir) {
  const files = fs.readdirSync(dir);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.resolve(dir, files[i]);
    const isDir = fs.lstatSync(filePath).isDirectory();
    if (isDir) {
      loadPlugins(filePath);
    } else {
      const extname = path.extname(filePath);
      if (extname === ".js") {
        const plugin = require(filePath);
        const commandName = plugin.name;
        if (commandName) {
          setExecPlugins(commandName, plugin.exec);
        }
      }
    }
  }
}

function isNotEmpty(val) {
  if (val === null || val === undefined || val === "") {
    return false;
  }
  return true;
}
// 将字符串中的./替换为绝对路径 0是本地路径，1是远程路径
function replacePath(config, type, targetPath) {
  targetPath = targetPath.trim();
  if (targetPath.startsWith("./") || targetPath.startsWith("../")) {
    targetPath = path.join(type === 0? config.localBaseDir : config.remoteBaseDir, targetPath);
    // 将路径中的斜杠替换为正斜杠
    if (type === 1) {
      targetPath = targetPath.replace(/\\/g, "/");
    }
  }
  return targetPath;
}

// 获取当前时间
function getCurrentTime() {
  if (globalSetter.config && globalSetter.config.isPrintCurTime) {
    return dayjs().format("YYYY-MM-DD HH:mm:ss") + ' '
  }
  return '';
}

// 将毫秒数转换成时分秒等单位
function formatMS(ms) {
  if (ms < 1000) {
    return `${ms}毫秒`;
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(3)}秒`;
  } else if (ms < 3600000) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(3);
    return `${minutes}分${seconds}秒`;
  } else {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(3);
    return `${hours}小时${minutes}分${seconds}秒`;
  }
}


module.exports = {
  initConfig,
  readConfig,
  connectServer,
  disconnectServer,
  uploadFile,
  execLocalCommand,
  execServerCommand,
  preCommand,
  parseCommand,
  logBlue,
  logGreen,
  logRed,
  getVersion,
  setExecPlugins,
  getExecPlugins,
  loadPlugins,
  isNotEmpty,
  replacePath,
  getCurrentTime,
  formatMS,
  globalSetter
};
