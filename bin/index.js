#!/usr/bin/env node
const program = require("commander");
const { init, exec, vgen } = require("../src/main");
const { getVersion } = require("../src/tools");

program
  .version(getVersion())
  .name('rdt')
  .description('A simple remote deployment tool')
  .usage("[option|command]")

program
  .command("init")
  .argument('[filename]')
  .alias("i")
  .description("初始化配置文件")
  .action(init);

program
  .command("exec")
  .argument('[jsonfile dir or filepath]')
  .alias("e")
  .description("执行脚本")
  .action((filePath) => {
    exec(filePath)
  });

program
  .command("vgen")
  .alias("g")
  .description("通过web界面可视化生成配置文件")
  .action(() => {
    vgen()
  });

program.parse(process.argv);
