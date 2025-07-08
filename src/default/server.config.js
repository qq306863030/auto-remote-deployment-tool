module.exports = {
  description: "",
  host: "127.0.0.1",
  port: 22,
  username: "root",
  password: "password",
  localBaseDir: "./", // 本地执行命令的根目录
  remoteBaseDir: "/home", // 远端执行命令的根目录
  isPrintResult: true, // 是否打印执行结果
  isPrintCurCommand: false, // 是否打印当前执行的命令
  isPrintTotalExecTime: true, // 是否打印总执行时间
  commands: [
    "[local:]echo 'hello world'",
    "[remote:]cd /usr;ls -al",
    "[upload:]{localBaseDir}/test.txt,{remoteBaseDir}/test{time-[YYYY-MM-DD HH:mm:ss]}.txt",
    "[print:]脚本执行完成",
  ],
  footer: "you need to install rdtool first: npm install rdtool -g"
};
