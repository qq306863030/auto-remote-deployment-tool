# auto-remote-deployment-tool
![QQ](https://img.shields.io/badge/QQ-306863030-green.svg) [![Gitee](https://img.shields.io/badge/Gitee-roman_123-blue.svg)](https://gitee.com/roman_123/auto-remote-deployment-tool) [![GitHub](https://img.shields.io/badge/GitHub-roman_123-blue.svg)](https://github.com/qq306863030/auto-remote-deployment-tool) [![NPM](https://img.shields.io/badge/NPM-roman_123-blue.svg)](https://www.npmjs.com/package/auto-remote-deployment-tool) ![HOME](https://img.shields.io/badge/HOME-auto_remote_deployment_tool-blue)

> A simple Node.js-based remote deployment tool that makes deployments easier with config files. 

[English](readme.md) | [简体中文](readme.zh-CN.md)

## Installation
```bash
npm install -g auto-remote-deployment-tool
```
## Usage
```bash
remoted init [configFileName] # Generate a server.config.js/json configuration file in the current directory. If the host is not configured, it will not connect to the remote server.
remoted exec [configFilePath] # Execute the commands in the specified configuration file (example: remoted exec ./remote.config.json) or specify a directory to automatically find the server.config.json file in the specified directory (example: remoted exec ./src/). By default, it looks for the server.config.json file in the current directory.
```
## Introduction
```bash
# Configuration file
    "description": "A configuration file example", // Description of the configuration file, displayed when the program starts
    "host": "127.0.0.1", // IP address of the remote server
    "port": 22, // SSH port of the remote server
    "username": "root", // Username for the remote server
    "password": "password", // Password for the remote server
    "privateKeyPath"?: "C:/id_rsa", // Path to the private key file of the remote server (choose one of password or private key)
    "localBaseDir": "./", // Root directory for executing commands locally
    "remoteBaseDir": "/home", // Root directory for executing commands on the remote server
    "isPrintResult": true, // Whether to print the execution result
    "isPrintCurCommand": false, // Whether to print the current executing command
    "isPrintTotalExecTime": true, // Whether to print the total execution time
    "commands": [] // Command array
# commands：
## Prefix (if no prefix is entered, [remote:] is used by default):
[local:] # Execute local commands
[local-cd:] # Switch the local base directory path (dynamically switch the localBaseDir in the configuration file, example: [local-cd:]targetPath)
[local-pwd:] # Get the current local base directory path (example: [local-pwd:])
[remote:] # Execute remote commands
[remote-cp:] # Execute remote copy command (example: [remote-cp:]originPath,targetPath)
[remote-mv:] # Execute remote move command (example: [remote-mv:]originPath,targetPath)
[remote-rm:] # Execute remote delete command ([remote-rm:][targetPath,targetPath,targetPath,targetPath...|targetPath/*], example 1: [remote-rm:]./test1.txt,./test2.txt  example 2: [remote-rm:]./test/*)
[remote-mkdir:] # Execute remote create directory command (example: [remote-mkdir:]targetPath)
[remote-hasPath:] # Check if a remote file or directory exists, return true or false (example: [remote-hasPath:]targetPath)
[remote-hasPort:] # Check if a remote port is occupied, return true or false (example: [remote-hasPort:]8080)
[remote-cd:] # Switch the remote base directory path (dynamically switch the remoteBaseDir in the configuration file, example: [remote-cd:]targetPath)
[remote-pwd:] # Get the current remote base directory path (example: [remote-pwd:])
[upload:] # Upload files or directories ([upload:]localPath,remotePath,includeKeyWords,excludeKeyWords  example 1:[upload:]./dist,/{remoteBaseDir}/dist  example 2: [upload:]./dist,/{remoteBaseDir}/dist,[.js,.css,.html],[.tmp,.bak]  example 3: [upload:]./dist,/{remoteBaseDir}/dist,,[.tmp,.bak])
[print:] # Print information in the current console
[sleep:] # Pause execution for the specified number of milliseconds (example: [sleep:]3000)
[record-exec-time:] Custom identifier # Record the execution time of the command (example: [record-exec-time:]record1)
[print-exec-time:] # Print the execution time of the command, needs to be used in pairs with [record-exec-time:]
[print-time:] # Print the current time
## Parameters that can be added to the command prefix (example: [remote(isNotPrint, isSkipErr):])
isNotPrint # Do not print information in the current console
isSkipErr # When the current command execution errors, skip and execute the next command instead of exiting the process
isBoolInversion # Invert the boolean value, that is, true becomes false and false becomes true
## Strings that will be automatically replaced in the command: 
{localBaseDir} 
{remoteBaseDir} 
{time-[format]}(Replace with the current time, example: {time-[YYYY-MM-DD HH:mm:ss]}) 
{startTime-[format]}(Replace with the start time of executing the script, example: {startTime-[YYYY-MM-DD HH:mm:ss]})
## commands can be nested in sub-arrays, which will be executed when the previous command returns true
```

## Configuration File Example
```js
module.exports = {
    "description": "A configuration file example",
    "host": "127.0.0.1",
    "port": 22,
    "username": "root",
    "password": "password",
    "localBaseDir": "./", // Root directory for executing commands locally
    "remoteBaseDir": "/home", // Root directory for executing commands on the remote server
    "isPrintResult": true, // Whether to print the execution result
    "isPrintCurCommand": false, // Whether to print the current executing command
    "isPrintTotalExecTime": true, // Whether to print the total execution time
    "commands": [
        "[local:]npm run build", // Execute local command to package files
        "[remote:]cd /usr;ls -al", // View the details of the current directory
        "[upload:]./dist,{remoteBaseDir}/dist", // Upload the project directory
        "[upload:]./test.txt,{remoteBaseDir}/test.txt", // Upload the file
        "[upload:]./test.txt,{remoteBaseDir}/test{startTime-[YYYY-MM-DD_HH-mm-ss]}.txt", // Upload the file and add a timestamp
        "[remote-mkdir:]{remoteBaseDir}/test-dir", // Create a directory
        "[remote-cp:]{remoteBaseDir}/test.txt,{remoteBaseDir}/test-dir/test.txt", // Remotely copy the file
        "[remote-mv:]{remoteBaseDir}/test.txt,{remoteBaseDir}/test{startTime-[YYYY-MM-DD]}.txt", // Rename the file
        "[remote-rm:]{remoteBaseDir}/test.txt", // Delete the file
        "[remote-rm:]{remoteBaseDir}/dist", // Delete the directory
        "[print:]Script execution completed"
    ]
module.exports = {
    "host": "116.196.68.99",
    "port": 22,
    "username": "root",
    "password": "ZYzx1357%",
    "localBaseDir": "./",
    "remoteBaseDir": "/home",
	"isPrintResult": true, // Whether to print the execution result
	"isPrintCurCommand": true, // Whether to print the current executing command
    "isPrintTotalExecTime": true, // Whether to print the total execution time
    "commands": [
		"[local:]echo 'hello world'", // Print 'hello world' and output the return content 'hello world'
		"[local(isNotPrint):]echo 'hello world'", // Only print 'hello world' without outputting the return content
		"[remote-hasPath:]/usr", // Check if the usr directory exists, return true
		"[remote-hasPath:]/my-remote-test", // Check if the my-remote-test directory exists, return false
		"[remote(isSkipErr):]cd /my-dir/my-remote-test", // Create the directory /dir/my-remote-test. Since the path does not exist, the creation fails, and isSkipErr skips the error
		"[remote(isSkipErr, isNotPrint):]cd /my-dir/my-remote-test", // Create the directory /dir/my-remote-test. Since the path does not exist, the creation fails, isSkipErr skips the error, and isNotPrint does not print the error message
		"[remote-mkdir:]/my-remote-test", // Create the directory /my-remote-test
		"[remote-hasPath:]/my-remote-test", // Check if the my-remote-test directory exists, return true, and execute the following array content
		[
			"[remote:]cd /my-remote-test;mkdir /my-remote-test/test1", // Create the directory test1 in the my-remote-test directory
			"[remote-mv:]/my-remote-test/test1,/my-remote-test/test{time-[YYYY-MM-DD]}" // Rename test1
		],
		"[remote-hasPort:]8003", // Check if the port is occupied. If it returns false, the following array content will not be executed
		[
			"[remote-mkdir:]/my-remote-test/test2", // Create the directory test2
			"[print:]'Array execution'"
		],
		"[remote-hasPort(isBoolInversion, isNotPrint):]8003", // Check if the port is occupied. If it is occupied, return true. By setting isBoolInversion to invert, the final return is false, and the array is not executed
		[
			"[print:]'Array 2 execution'"
		],
		"[print:]Script execution completed"
    ]
```