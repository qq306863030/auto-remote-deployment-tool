
 # rdtool
 ![QQ](https://img.shields.io/badge/QQ-306863030-green.svg) [![Gitee](https://img.shields.io/badge/Gitee-roman_123-blue.svg)](https://gitee.com/roman_123/auto-remote-deployment-tool) [![GitHub](https://img.shields.io/badge/GitHub-roman_123-blue.svg)](https://github.com/qq306863030/auto-remote-deployment-tool) [![NPM](https://img.shields.io/badge/NPM-roman_123-blue.svg)](https://www.npmjs.com/package/auto-remote-deployment-tool) ![HOME](https://img.shields.io/badge/HOME-auto_remote_deployment_tool-blue)

> A simple Node.js-based remote deployment tool that makes deployments easier with config files.
> 一个基于nodejs的简单的远程部署工具，可以通过配置文件让部署工作变得更容易。

[简体中文](https://github.com/qq306863030/auto-remote-deployment-tool/blob/master/readme.md) | [English](https://github.com/qq306863030/auto-remote-deployment-tool/blob/master/readme.en.md)

## 安装
```bash
npm install -g rdtool
```

## 使用
```bash
rdt init [configFileName] # 在当前目录生成server.config.js/json配置文件, 如果host未配置, 则不连接远程服务器
rdt exec [configFilePath] # 执行指定配置文件中的命令(示例: rdt exec ./remote.config.json)或指定一个目录，自动在指定目录中查找server.config.json文件(示例: rdt exec ./src/),默认查找当前目录下的server.config.json文件
rdt vgen # 通过Web页面可视化生成一个配置文件模板
```

## 介绍
```bash
# 配置文件
{
    "description": "一个配置文件示例", // 配置文件描述，程序启动时显示
    "scriptCode": "", // 脚本执行命令（相对路径指向rdt命令执行的目录）
    "host": "127.0.0.1", // 远程服务器IP地址（设置为空时不连接远程服务器）
    "port": 22, // 远程服务器SSH端口
    "username": "root", // 远程服务器用户名
    "password": "password", // 远程服务器密码
    "privateKeyPath"?: "C:/id_rsa", // 远程服务器私钥文件路径（与密码选其一）
    "localBaseDir": "./", // 本地执行命令的根目录
    "remoteBaseDir": "/home", // 远端执行命令的根目录
    "isPrintResult": true, // 是否打印执行结果
    "isPrintCurCommand": true, // 是否打印当前执行的命令
    "isPrintCurTime": true, // 是否在执行中打印当前时间
    "isPrintTotalExecTime": true, // 是否打印总的执行时间
    "commands": [] // 命令数组
}


# commands：
## 前缀(如果没有输入前缀，默认使用[remote:])：
[local:] # 执行本地命令
[local-cd:] # 切换本地基础目录路径(动态切换配置文件中的localBaseDir, 示例: [local-cd:]targetPath)
[local-pwd:] # 获取当前本地基础目录路径(示例: [local-pwd:])
[local-zip:] # 本地压缩文件([local-zip:]originPath,targetPath 示例: [local-zip:]./dist,./dist.zip)
[remote:] # 执行远端命令
[remote-cp:] # 执行远程拷贝命令(示例: [remote-cp:]originPath,targetPath)
[remote-mv:] # 执行远程剪切命令(示例: [remote-mv:]originPath,targetPath)
[remote-rm:] # 执行远程删除命令([remote-rm:][targetPath,targetPath,targetPath,targetPath...|targetPath/*], 示例1: [remote-rm:]./test1.txt,./test2.txt 示例2: [remote-rm:]./test/*)
[remote-mkdir:] # 执行远程创建目录命令(示例: [remote-mkdir:]targetPath)
[remote-hasPath:] # 判断远程文件或目录是否存在，返回true或false(示例: [remote-hasPath:]targetPath)
[remote-hasPort:] # 判断远程端口是否被占用，返回true或false(示例: [remote-hasPort:]8080)
[remote-cd:] # 切换远程基础目录路径(动态切换配置文件中的remoteBaseDir, 示例: [remote-cd:]targetPath)
[remote-pwd:] # 获取当前远程基础目录路径(示例: [remote-pwd:])
[upload:] # 上传文件或目录 ([upload:]localPath,remotePath,includeKeyWords,excludeKeyWords 示例1:[upload:]./dist,/{remoteBaseDir}/dist  示例2: [upload:]./dist,/{remoteBaseDir}/dist,[.js,.css,.html],[.tmp,.bak] 示例3: [upload(isPrintUploadPath):]./dist,/{remoteBaseDir}/dist,[],[.tmp,.bak])
[print:] # 在当前控制台打印信息
[sleep:] # 暂停执行指定毫秒数(示例: [sleep:]3000)
[record-exec-time:]自定义标识符 # 记录执行命令消耗时间(示例：[record-exec-time:]record1)
[print-exec-time:] # 打印执行命令消耗时间, 需与[record-exec-time:]成对使用
[print-time:] # 打印当前时间


## 可在命令前缀中增加的参数(示例：[remote(isNotPrint, isSkipErr):])
isNotPrint # 不在当前控制台打印信息
isSkipErr # 当前命令执行报错时跳过并执行下一条命令，而不是退出进程
isBoolInversion # 布尔值取反，即true变false，false变true
isPrintUploadPath # 显示正在上传的文件路径, 仅用于文件上传命令(示例：[upload(isPrintUploadPath):]./dist,./dist,[],[])

## 命令中会自动替换的字符串： 
{localBaseDir} 
{remoteBaseDir} 
{time-[format]}(替换为当前时间，示例: {time-[YYYY-MM-DD HH:mm:ss]}) 
{startTime-[format]}(替换为开始执行脚本的时间，示例: {startTime-[YYYY-MM-DD HH:mm:ss]})

## commands可以嵌套子数组，当上一条命令返回true时执行
```

## 配置文件示例
```js
module.exports = {
    "description": "一个配置文件示例",
    "scriptCode": "rdt exec ./server.config.js", // 脚本执行命令（相对路径指向rdt命令执行的目录, 该字段仅作为记录标识）
    "host": "127.0.0.1",
    "port": 22,
    "username": "root",
    "password": "password",
    "localBaseDir": "./",
    "remoteBaseDir": "/home",
    "isPrintResult": true, // 是否打印执行结果
    "isPrintCurCommand": true, // 是否打印当前执行的命令
    "isPrintTotalExecTime": true, // 是否打印总的执行时间
    "isPrintCurTime": true, // 是否在执行中打印当前时间
    "commands": [
        "[local:]npm run build", // 本地执行命令, 打包文件
        "[remote:]cd /usr;ls -al", // 查看当前目录详情
        "[upload:]./dist,./dist", // 上传项目目录
        "[upload:]./test.txt,./test.txt", // 上传文件并增加时间戳
        "[upload(isPrintUploadPath):]./test.txt,./test{startTime-[YYYY-MM-DD_HH-mm-ss]}.txt", // 上传文件并增加时间戳, 打印上传路径
        "[remote-mkdir:]./test-dir", // 创建一个目录
        "[remote-cp:]./test.txt,./test-dir/test.txt", // 远程拷贝文件
        "[remote-mv:]./test.txt,./test{startTime-[YYYY-MM-DD]}.txt", // 重命名文件
        "[remote-rm:]./test.txt", // 删除文件
        "[remote-rm:]./dist", // 删除目录
        "[print:]脚本执行完成"
    ]
}



module.exports = {
    "description": "一个配置文件示例",
    "scriptCode": "rdt exec ./server.config.js", // 脚本执行命令（相对路径指向rdt命令执行的目录）
    "host": "127.0.0.1",
    "port": 22,
    "username": "root",
    "password": "password",
    "localBaseDir": "./",
    "remoteBaseDir": "/home",
    "isPrintResult": true, // 是否打印执行结果
    "isPrintCurCommand": true, // 是否打印当前执行的命令
    "isPrintTotalExecTime": true, // 是否打印总的执行时间
    "isPrintCurTime": true, // 是否在执行中打印当前时间
    "commands": [
		"[local:]echo 'hello world'", // 打印hello world，并输出返回内容hello world
		"[local(isNotPrint):]echo 'hello world'", // 仅打印hello world，不输出返回内容
		"[remote-hasPath:]/usr", // 判断usr目录是否存在，返回true
		"[remote-hasPath:]/my-remote-test", // 判断my-remote-test目录是否存在，返回false
		"[remote(isSkipErr):]cd /my-dir/my-remote-test", // 创建目录/dir/my-remote-test，由于路径不存在创建失败，isSkipErr跳过错误
		"[remote(isSkipErr, isNotPrint):]cd /my-dir/my-remote-test", // 创建目录/dir/my-remote-test，由于路径不存在创建失败，isSkipErr跳过错误, isNotPrint不打印报错信息
		"[remote-mkdir:]/my-remote-test", // 创建目录/my-remote-test
		"[remote-hasPath:]/my-remote-test", // 判断my-remote-test目录是否存在，返回true，执行以下数组的内容
		[
			"[remote:]cd /my-remote-test;mkdir /my-remote-test/test1", // 在目录my-remote-test中创建目录test1
			"[remote-mv:]/my-remote-test/test1,/my-remote-test/test{time-[YYYY-MM-DD]}" // 重命名test1
		],
        "[remote-hasPath:]./my-remote-test2", // 判断my-remote-test2目录是否存在
		[
			[
                "[remote:]cd ./my-remote-test2;mkdir ./test2", // 返回true，执行数组中第一个元素，在目录my-remote-test2中创建目录test2
            ],
            [
                "[remote-mkdir:]./my-remote-test2", // 返回false，执行数组中第二个元素，创建目录my-remote-test2
            ]
		],
		"[remote-hasPort:]8003", // 判断端口是否被占用, 如果返回false,则不执行以下数组的内容
		[
			"[remote-mkdir:]/my-remote-test/test2", // 创建目录test2
			"[print:]'数组执行'"
		],
		"[remote-hasPort(isBoolInversion, isNotPrint):]8003", // 判断端口是否被占用, 如果被占用，则返回true，通过设置isBoolInversion取反，最后返回false，数组不执行
		[
			"[print:]'数组2执行'"
		],
		"[print:]脚本执行完成"
    ]
}
```

## 注意
1.报错Error [ERR_REQUIRE_ESM]: require() of ES Module ... 解决方案：将配置文件后缀名修改为.cjs