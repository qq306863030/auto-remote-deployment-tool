const { createApp, ref, computed, watch } = Vue

createApp({
  setup() {
    // 命令类型数据（按照文档顺序，中文名称在前）
    const commandTypes = ref([
      {
        id: 'remote',
        name: '远程命令',
        prefix: '[remote:]',
        description: '在远程服务器执行命令',
        inputType: 'single',
        hasOptions: true,
        defaultText: 'cd /usr;ls -al',
        fullWidth: false,
      },
      {
        id: 'local',
        name: '本地命令',
        prefix: '[local:]',
        description: '在本地执行命令',
        inputType: 'single',
        hasOptions: true,
        defaultText: 'npm run build',
        fullWidth: false,
      },
      {
        id: 'local-cd',
        name: '本地切换目录',
        prefix: '[local-cd:]',
        description: '切换本地基础目录路径',
        inputType: 'single',
        hasOptions: true,
        defaultText: './dist',
        fullWidth: true,
      },
      {
        id: 'local-pwd',
        name: '本地获取当前目录',
        prefix: '[local-pwd:]',
        description: '获取当前本地基础目录路径',
        noInput: true,
        hasOptions: true,
        fullWidth: false,
      },
      {
        id: 'local-zip',
        name: '本地压缩文件',
        prefix: '[local-zip:]',
        description: '本地压缩文件',
        inputType: 'double',
        hasOptions: true,
        defaultText1: './dist',
        defaultText2: './dist.zip',
        fullWidth: false,
      },
      {
        id: 'remote-cp',
        name: '远程拷贝',
        prefix: '[remote-cp:]',
        description: '执行远程拷贝命令',
        inputType: 'double',
        hasOptions: true,
        defaultText1: './test.txt',
        defaultText2: './test-dir/test.txt',
        fullWidth: false,
      },
      {
        id: 'remote-mv',
        name: '远程剪切',
        prefix: '[remote-mv:]',
        description: '执行远程剪切命令',
        inputType: 'double',
        hasOptions: true,
        defaultText1: './test.txt',
        defaultText2: './test-new.txt',
        fullWidth: false,
      },
      {
        id: 'remote-rm',
        name: '远程删除',
        prefix: '[remote-rm:]',
        description: '执行远程删除命令',
        inputType: 'single',
        hasOptions: true,
        fullWidth: true,
        defaultText: './test1.txt,./test2.txt',
      },
      {
        id: 'remote-mkdir',
        name: '远程创建目录',
        prefix: '[remote-mkdir:]',
        description: '执行远程创建目录命令',
        inputType: 'single',
        hasOptions: true,
        defaultText: './test-dir',
        fullWidth: true,
      },
      {
        id: 'remote-hasPath',
        name: '远程路径存在检查',
        prefix: '[remote-hasPath:]',
        description: '判断远程文件或目录是否存在',
        inputType: 'single',
        hasOptions: true,
        defaultText: '/usr',
        fullWidth: true,
        isBoolean: true,
      },
      {
        id: 'remote-hasPort',
        name: '远程端口占用检查',
        prefix: '[remote-hasPort:]',
        description: '判断远程端口是否被占用',
        inputType: 'single',
        hasOptions: true,
        defaultText: '8080',
        fullWidth: true,
        isBoolean: true,
      },
      {
        id: 'remote-cd',
        name: '远程切换目录',
        prefix: '[remote-cd:]',
        description: '切换远程基础目录路径',
        inputType: 'single',
        hasOptions: true,
        defaultText: '/home/user',
        fullWidth: true,
      },
      {
        id: 'remote-pwd',
        name: '远程获取当前目录',
        prefix: '[remote-pwd:]',
        description: '获取当前远程基础目录路径',
        noInput: true,
        hasOptions: true,
        fullWidth: false,
      },
      {
        id: 'upload',
        name: '上传文件',
        prefix: '[upload:]',
        description: '上传文件或目录',
        inputType: 'upload',
        hasOptions: true,
        defaultText1: './dist',
        defaultText2: './dist',
        defaultText3: '',
        defaultText4: '',
        fullWidth: false,
      },
      {
        id: 'print',
        name: '打印信息',
        prefix: '[print:]',
        description: '在当前控制台打印信息',
        inputType: 'single',
        hasOptions: true,
        fullWidth: true,
        defaultText: '脚本执行完成',
      },
      {
        id: 'sleep',
        name: '暂停执行',
        prefix: '[sleep:]',
        description: '暂停执行指定毫秒数',
        inputType: 'single',
        hasOptions: true,
        defaultText: '3000',
        fullWidth: true,
      },
      {
        id: 'record-exec-time',
        name: '记录执行时间',
        prefix: '[record-exec-time:]',
        description: '记录执行命令消耗时间',
        inputType: 'record-exec-time',
        hasOptions: true,
        defaultText: 'record1',
        fullWidth: true,
      },
      {
        id: 'print-exec-time',
        name: '打印执行时间',
        prefix: '[print-exec-time:]',
        description: '打印执行命令消耗时间',
        inputType: 'print-exec-time',
        hasOptions: true,
        defaultText: 'record1',
        fullWidth: true,
      },
      {
        id: 'print-time',
        name: '打印当前时间',
        prefix: '[print-time:]',
        description: '打印当前时间',
        noInput: true,
        hasOptions: true,
        fullWidth: false,
      },
    ])

    const allCommandOptions = ref([
      {
        id: 'isNotPrint',
        name: '不打印输出',
        description: '不在当前控制台打印信息',
      },
      {
        id: 'isSkipErr',
        name: '跳过错误',
        description: '当前命令执行报错时跳过并执行下一条命令',
      },
      {
        id: 'isBoolInversion',
        name: '布尔取反',
        description: '布尔值取反，即true变false，false变true',
      },
      {
        id: 'isPrintUploadPath',
        name: '显示上传路径',
        description: '显示正在上传的文件路径，仅用于文件上传命令',
      },
    ])

    // 配置数据
    const configData = ref({
      filename: 'server',
      description: 'RDTool配置文件',
      host: '127.0.0.1',
      port: 22,
      username: 'root',
      password: 'password',
      privateKeyPath: '',
      localBaseDir: './',
      remoteBaseDir: '/home',
      isPrintResult: true,
      isPrintCurCommand: true,
      isPrintCurTime: true,
      isPrintTotalExecTime: true,
      commands: [],
    })

    // 密码显示状态
    const showPassword = ref(true)

    // 通知系统
    const notification = ref({
      show: false,
      message: '',
      type: 'info',
    })

    // 子命令展开状态
    const expandedChildCommands = ref({})

    // 获取命令类型对象
    const getCmdType = (typeId) => {
      const cmdType = commandTypes.value.find((t) => t.id === typeId)
      return cmdType || commandTypes.value[0] // 如果找不到，返回第一个作为默认
    }

    // 根据命令类型获取可用的选项
    const getAvailableOptions = (commandType) => {
      const options = allCommandOptions.value.filter((option) => {
        // isBoolInversion 只对 remote-hasPath 和 remote-hasPort 显示
        if (option.id === 'isBoolInversion') {
          return (
            commandType === 'remote-hasPath' || commandType === 'remote-hasPort'
          )
        }
        // isPrintUploadPath 只对 upload 显示
        if (option.id === 'isPrintUploadPath') {
          return commandType === 'upload'
        }
        // 其他选项对所有有选项的命令显示
        return true
      })

      return options
    }

    // 获取输入框标签
    const getInputLabel = (commandType) => {
      const cmd = getCmdType(commandType)

      switch (commandType) {
        case 'local-cd':
          return '本地基础目录路径'
        case 'local-zip':
          return '压缩文件参数'
        case 'remote-cp':
          return '拷贝文件参数'
        case 'remote-mv':
          return '剪切文件参数'
        case 'remote-rm':
          return '目标路径（多个路径用逗号分隔）'
        case 'remote-mkdir':
          return '目标目录路径'
        case 'remote-hasPath':
          return '目标路径'
        case 'remote-hasPort':
          return '端口号'
        case 'remote-cd':
          return '远程基础目录路径'
        case 'sleep':
          return '暂停毫秒数'
        case 'print':
          return '要打印的信息'
        case 'record-exec-time':
          return '记录执行时间标识符'
        case 'print-exec-time':
          return '打印执行时间标识符'
        default:
          return '命令内容'
      }
    }

    // 获取输入框占位符
    const getInputPlaceholder = (commandType, index = 1) => {
      const cmd = getCmdType(commandType)

      if (cmd.inputType === 'double') {
        if (index === 1) {
          switch (commandType) {
            case 'local-zip':
              return '源文件路径，例如: ./dist'
            case 'remote-cp':
              return '源文件路径，例如: ./test.txt'
            case 'remote-mv':
              return '源文件路径，例如: ./test.txt'
            default:
              return '参数1'
          }
        } else if (index === 2) {
          switch (commandType) {
            case 'local-zip':
              return '目标文件路径，例如: ./dist.zip'
            case 'remote-cp':
              return '目标文件路径，例如: ./test-dir/test.txt'
            case 'remote-mv':
              return '目标文件路径，例如: ./test-new.txt'
            default:
              return '参数2'
          }
        }
      }

      // 单输入框类型
      switch (commandType) {
        case 'remote':
          return '输入远程命令，例如: cd /usr;ls -al'
        case 'local':
          return '输入本地命令，例如: npm run build'
        case 'local-cd':
          return '本地基础目录路径，例如: ./dist'
        case 'remote-rm':
          return '目标路径（多个路径用逗号分隔）或通配符路径，例如: ./test1.txt,./test2.txt 或 ./test/*'
        case 'remote-mkdir':
          return '目标目录路径，例如: ./test-dir'
        case 'remote-hasPath':
          return '目标路径，例如: /usr'
        case 'remote-hasPort':
          return '端口号，例如: 8080'
        case 'remote-cd':
          return '远程基础目录路径，例如: /home/user'
        case 'sleep':
          return '暂停毫秒数，例如: 3000'
        case 'print':
          return '要打印的信息，例如: 脚本执行完成'
        case 'record-exec-time':
          return '自定义标识符，例如: record1'
        case 'print-exec-time':
          return '自定义标识符，需与[record-exec-time:]成对使用'
        default:
          return '输入命令内容'
      }
    }

    // 更新命令的默认值
    const updateCommandDefaults = (command) => {
      const cmdType = getCmdType(command.type)

      // 重置输入字段
      command.text = ''
      command.input1 = ''
      command.input2 = ''
      command.input3 = ''
      command.input4 = ''

      // 根据命令类型设置默认值
      if (cmdType.inputType === 'single' && cmdType.defaultText) {
        command.text = cmdType.defaultText
      } else if (cmdType.inputType === 'double') {
        command.input1 = cmdType.defaultText1 || ''
        command.input2 = cmdType.defaultText2 || ''
      } else if (cmdType.inputType === 'upload') {
        command.input1 = cmdType.defaultText1 || ''
        command.input2 = cmdType.defaultText2 || ''
        command.input3 = cmdType.defaultText3 || ''
        command.input4 = cmdType.defaultText4 || ''
      } else if (
        cmdType.inputType === 'record-exec-time' ||
        cmdType.inputType === 'print-exec-time'
      ) {
        command.text = cmdType.defaultText || ''
      }
      command.isBoolean = Boolean(cmdType.isBoolean)
      // 重置选项
      command.options = []
    }

    // 添加一条初始命令
    const addInitialCommand = () => {
      addCommand('remote', 'cd /usr;ls -al')
    }

    // 添加命令
    const addCommand = (type = 'remote', text = '') => {
      if (typeof type !== 'string') {
        type = 'remote'
        text = ''
      }
      const commandId = Date.now() + Math.random()
      const cmdType = getCmdType(type)
      const newCommand = {
        id: commandId,
        type: type,
        isBoolean: cmdType?.isBoolean || false,
        text: text || cmdType?.defaultText || '',
        input1: cmdType?.defaultText1 || '',
        input2: cmdType?.defaultText2 || '',
        input3: cmdType?.defaultText3 || '',
        input4: cmdType?.defaultText4 || '',
        options: [],
        childCommands: [[], []], // 二维数组：第一项是true分支，第二项是false分支
      }

      configData.value.commands.push(newCommand)
    }

    // 删除命令
    const removeCommand = (index) => {
      configData.value.commands.splice(index, 1)
      showNotification('命令已删除', 'success')
    }

    // 复制命令
    const duplicateCommand = (index) => {
      const command = JSON.parse(
        JSON.stringify(configData.value.commands[index])
      )
      command.id = Date.now() + Math.random()
      configData.value.commands.splice(index + 1, 0, command)
      showNotification('命令已复制', 'success')
    }

    // 上移命令
    const moveCommandUp = (index) => {
      if (index > 0) {
        const temp = configData.value.commands[index]
        configData.value.commands[index] = configData.value.commands[index - 1]
        configData.value.commands[index - 1] = temp
      }
    }

    // 下移命令
    const moveCommandDown = (index) => {
      if (index < configData.value.commands.length - 1) {
        const temp = configData.value.commands[index]
        configData.value.commands[index] = configData.value.commands[index + 1]
        configData.value.commands[index + 1] = temp
      }
    }

    // 切换子命令展开状态
    const toggleChildCommands = (commandId, bool) => {
      console.log(commandId, bool)
      expandedChildCommands.value[commandId + '_' + bool] =
        !expandedChildCommands.value[commandId + '_' + bool]
    }

    // 添加子命令
    const addChildCommand = (parentCommand, branchIndex = 0) => {
      const commandId = Date.now() + Math.random()
      const newChildCommand = {
        id: commandId,
        type: 'remote',
        isBoolean: false,
        text: 'ls -al',
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        options: [],
        childCommands: [[], []],
      }

      // 确保parentCommand.childCommands存在
      if (!parentCommand.childCommands) {
        parentCommand.childCommands = [[], []]
      }

      // 确保branchIndex对应的数组存在
      if (!parentCommand.childCommands[branchIndex]) {
        parentCommand.childCommands[branchIndex] = []
      }

      parentCommand.childCommands[branchIndex].push(newChildCommand)
      if (branchIndex === 0) {
        expandedChildCommands.value[parentCommand.id + '_true'] = true
      } else {
        expandedChildCommands.value[parentCommand.id + '_false'] = true
      }
      showNotification(
        `已添加${branchIndex === 0 ? 'True' : 'False'}分支子命令`,
        'success'
      )
    }

    // 移除子命令
    const removeChildCommand = (parentCommand, branchIndex, childIndex) => {
      if (
        parentCommand.childCommands &&
        parentCommand.childCommands[branchIndex] &&
        parentCommand.childCommands[branchIndex][childIndex]
      ) {
        parentCommand.childCommands[branchIndex].splice(childIndex, 1)
        if (parentCommand.childCommands[branchIndex].length === 0) {
          expandedChildCommands.value[
            parentCommand.id + '_' + !Boolean(branchIndex)
          ] = false
        }
      }
      showNotification('子命令已删除', 'success')
    }

    // 上移子命令
    const moveChildCommandUp = (parentCommand, branchIndex, childIndex) => {
      if (
        childIndex > 0 &&
        parentCommand.childCommands &&
        parentCommand.childCommands[branchIndex]
      ) {
        const temp = parentCommand.childCommands[branchIndex][childIndex]
        parentCommand.childCommands[branchIndex][childIndex] =
          parentCommand.childCommands[branchIndex][childIndex - 1]
        parentCommand.childCommands[branchIndex][childIndex - 1] = temp
      }
    }

    // 下移子命令
    const moveChildCommandDown = (parentCommand, branchIndex, childIndex) => {
      if (
        parentCommand.childCommands &&
        parentCommand.childCommands[branchIndex] &&
        childIndex < parentCommand.childCommands[branchIndex].length - 1
      ) {
        const temp = parentCommand.childCommands[branchIndex][childIndex]
        parentCommand.childCommands[branchIndex][childIndex] =
          parentCommand.childCommands[branchIndex][childIndex + 1]
        parentCommand.childCommands[branchIndex][childIndex + 1] = temp
      }
    }

    // 切换密码显示
    const togglePasswordVisibility = () => {
      showPassword.value = !showPassword.value
    }

    // 生成命令字符串
    const generateCommandString = (command) => {
      const cmdType = getCmdType(command.type)

      let commandStr = ''
      let prefix = cmdType.prefix

      // 构建命令前缀，处理选项
      if (command.options && command.options.length > 0) {
        // 将前缀中的]:替换为(选项):]
        prefix = prefix.replace(':]', `(${command.options.join(',')}):]`)
      }

      // 根据命令类型构建命令内容
      if (cmdType.noInput) {
        // 无输入的命令
        commandStr = prefix
      } else if (cmdType.inputType === 'single') {
        // 单输入框命令
        commandStr = prefix + command.text
      } else if (cmdType.inputType === 'double') {
        // 双输入框命令，用逗号分隔
        commandStr = prefix + command.input1 + ',' + command.input2
      } else if (cmdType.inputType === 'upload') {
        // 上传命令，有四个参数
        let params = command.input1 + ',' + command.input2
        if (command.input3 || command.input4) {
          params += ',' + command.input3 + ',' + command.input4
        }
        commandStr = prefix + params
      } else if (
        cmdType.inputType === 'record-exec-time' ||
        cmdType.inputType === 'print-exec-time'
      ) {
        // 记录/打印执行时间命令
        commandStr = prefix + command.text
      }

      return commandStr
    }

    // 递归生成命令数组（支持子命令）
    const generateCommandArray = (command) => {
      const commandStr = generateCommandString(command)

      // 检查是否有子命令
      if (
        command.childCommands &&
        (command.childCommands[0].length > 0 ||
          command.childCommands[1].length > 0)
      ) {
        // 构建子命令数组
        const childArray = []

        // 处理true分支
        if (command.childCommands[0].length > 0) {
          const trueBranch = command.childCommands[0].map((child) =>
            generateCommandArray(child)
          )
          childArray.push(trueBranch)
        }

        // 处理false分支
        if (command.childCommands[1].length > 0) {
          const falseBranch = command.childCommands[1].map((child) =>
            generateCommandArray(child)
          )

          // 根据文档，如果只有false分支，需要前面放一个空数组
          if (command.childCommands[0].length === 0) {
            childArray.push([])
          }

          childArray.push(falseBranch)
        }

        // 返回包含子命令的数组
        return [commandStr, childArray]
      }

      // 没有子命令，直接返回命令字符串
      return commandStr
    }

    // 生成最终的配置对象
    const generateConfig = () => {
      const config = {
        description: configData.value.description,
        scriptCode: `rdt exec ./${configData.value.filename}.config.js`,
        host: configData.value.host,
        port: configData.value.port,
        username: configData.value.username,
        password: configData.value.password,
        localBaseDir: configData.value.localBaseDir,
        remoteBaseDir: configData.value.remoteBaseDir,
        isPrintResult: configData.value.isPrintResult,
        isPrintCurCommand: configData.value.isPrintCurCommand,
        isPrintCurTime: configData.value.isPrintCurTime,
        isPrintTotalExecTime: configData.value.isPrintTotalExecTime,
        commands: [],
      }

      // 如果有私钥路径，添加
      if (configData.value.privateKeyPath.trim()) {
        config.privateKeyPath = configData.value.privateKeyPath
      }

      // 处理命令（支持子命令）
      configData.value.commands.forEach((cmd) => {
        const commandArray = generateCommandArray(cmd)
        config.commands.push(commandArray)
      })

      return config
    }

    // 格式化配置为JS格式（纯文本，无高亮）
    const formattedConfig = computed(() => {
      const config = generateConfig()
      return `module.exports = ${JSON.stringify(config, null, 2)};`
    })

    // 复制配置到剪贴板
    const copyConfig = () => {
      const config = generateConfig()
      const configText = `module.exports = ${JSON.stringify(config, null, 2)};`

      navigator.clipboard
        .writeText(configText)
        .then(() => {
          showNotification('配置已复制到剪贴板！', 'success')
        })
        .catch((err) => {
          console.error('复制失败: ', err)
          showNotification('复制失败，请手动复制', 'error')
        })
    }

    // 下载配置文件
    const downloadConfig = () => {
      const config = generateConfig()
      const configText = `module.exports = ${JSON.stringify(config, null, 2)};`
      const fileName = `${configData.value.filename}.config.js`

      const blob = new Blob([configText], { type: 'application/javascript' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      showNotification(`配置文件 ${fileName} 已下载！`, 'success')
    }

    // 重置配置
    const resetConfig = () => {
      if (confirm('确定要重置所有配置吗？这将清除所有命令和设置。')) {
        configData.value.filename = 'server'
        configData.value.description = 'RDTool配置文件'
        configData.value.host = '127.0.0.1'
        configData.value.port = 22
        configData.value.username = 'root'
        configData.value.password = 'password'
        configData.value.privateKeyPath = ''
        configData.value.localBaseDir = './'
        configData.value.remoteBaseDir = '/home'
        configData.value.isPrintResult = true
        configData.value.isPrintCurCommand = true
        configData.value.isPrintCurTime = true
        configData.value.isPrintTotalExecTime = true

        // 清空命令数组
        configData.value.commands = []

        // 清空展开状态
        expandedChildCommands.value = {}

        // 添加一条初始命令
        addInitialCommand()

        showNotification('配置已重置为默认值', 'success')
      }
    }

    // 显示通知
    const showNotification = (message, type = 'info') => {
      notification.value.message = message
      notification.value.type = type
      notification.value.show = true

      setTimeout(() => {
        notification.value.show = false
      }, 3000)
    }

    // 文件导入
    // 导入配置文件
    const importConfig = () => {
      document.getElementById('configFileInput').click()
    }

    // 处理文件选择
    const handleFileSelect = (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const fileContent = e.target.result
          const config = parseConfigFile(fileContent, file.name)
          loadConfig(config)
          showNotification('配置文件导入成功！', 'success')
        } catch (error) {
          console.error('配置文件解析失败:', error)
          showNotification('配置文件解析失败，请检查文件格式', 'error')
        }
      }

      reader.readAsText(file)

      // 重置文件输入，允许再次选择同一文件
      event.target.value = ''
    }

    // 解析配置文件内容
    const parseConfigFile = (content, fileName) => {
      // 移除可能的module.exports包装
      let configStr = content.trim()

      // 尝试解析为JavaScript模块
      if (fileName.endsWith('.js')) {
        // 提取module.exports部分
        const moduleExportsMatch = configStr.match(
          /module\.exports\s*=\s*({[\s\S]*})/
        )
        if (moduleExportsMatch) {
          configStr = moduleExportsMatch[1]
        }

        // 尝试移除尾部分号
        configStr = configStr.replace(/;\s*$/, '')
      }

      // 解析JSON
      try {
        return JSON.parse(configStr)
      } catch (error) {
        // 如果直接解析失败，尝试修复常见的JSON格式问题
        try {
          const func = new Function(`const config = ${configStr}; return config;`);
          const config = func();
          return config
        } catch (e) {
          throw new Error('无法解析配置文件格式')
        }
      }
    }

    // 加载配置到界面
    const loadConfig = (config) => {
      // 更新基本配置
      if (config.filename) configData.value.filename = config.filename
      if (config.description) configData.value.description = config.description
      if (config.host !== undefined) configData.value.host = config.host
      if (config.port !== undefined) configData.value.port = config.port
      if (config.username) configData.value.username = config.username
      if (config.password) configData.value.password = config.password
      if (config.privateKeyPath !== undefined)
        configData.value.privateKeyPath = config.privateKeyPath
      if (config.localBaseDir)
        configData.value.localBaseDir = config.localBaseDir
      if (config.remoteBaseDir)
        configData.value.remoteBaseDir = config.remoteBaseDir
      if (config.isPrintResult !== undefined)
        configData.value.isPrintResult = config.isPrintResult
      if (config.isPrintCurCommand !== undefined)
        configData.value.isPrintCurCommand = config.isPrintCurCommand
      if (config.isPrintCurTime !== undefined)
        configData.value.isPrintCurTime = config.isPrintCurTime
      if (config.isPrintTotalExecTime !== undefined)
        configData.value.isPrintTotalExecTime = config.isPrintTotalExecTime

      // 清空现有命令
      configData.value.commands = []

      // 解析命令数组
      if (config.commands && Array.isArray(config.commands)) {
        config.commands.forEach((command, index) => {
          // 处理命令字符串或数组
          if (typeof command === 'string') {
            addCommandFromString(command)
          } else if (Array.isArray(command)) {
            // 处理嵌套数组（子命令）
            if (command.length >= 2 && Array.isArray(command[1])) {
              // 这是带子命令的命令
              addCommandWithChildren(command[0], command[1])
            }
          }
        })
      }

      // 如果没有命令，添加一个默认命令
      if (configData.value.commands.length === 0) {
        addInitialCommand()
      }
    }

    // 从命令字符串添加命令
    const addCommandFromString = (commandStr) => {
      // 解析命令类型和选项
      const match = commandStr.match(/^\[([a-z\-]+)(?:\(([^)]+)\))?:\](.*)$/)
      if (!match) return

      const [, typeWithOpts, optionsStr, content] = match
      let type = typeWithOpts
      let options = []

      // 提取选项（如果有）
      if (optionsStr) {
        options = optionsStr.split(',').map((opt) => opt.trim())
        // 从类型中移除选项部分
        const typeMatch = typeWithOpts.match(/^([a-z\-]+)/)
        if (typeMatch) type = typeMatch[1]
      }

      // 创建命令对象
      const cmdType = getCmdType(type)
      if (!cmdType) return

      const commandId = Date.now() + Math.random()
      const command = {
        id: commandId,
        type: type,
        isBoolean: cmdType.isBoolean || false,
        text: '',
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        options: options,
        childCommands: [[], []],
      }

      // 根据命令类型解析内容
      if (cmdType.noInput) {
        // 无输入的命令，不需要处理内容
      } else if (cmdType.inputType === 'single') {
        command.text = content || cmdType.defaultText || ''
      } else if (cmdType.inputType === 'double') {
        const parts = (content || '').split(',')
        command.input1 = parts[0] || cmdType.defaultText1 || ''
        command.input2 = parts[1] || cmdType.defaultText2 || ''
      } else if (cmdType.inputType === 'upload') {
        const parts = (content || '').split(',')
        command.input1 = parts[0] || cmdType.defaultText1 || ''
        command.input2 = parts[1] || cmdType.defaultText2 || ''
        command.input3 = parts[2] || cmdType.defaultText3 || ''
        command.input4 = parts[3] || cmdType.defaultText4 || ''
      } else if (
        cmdType.inputType === 'record-exec-time' ||
        cmdType.inputType === 'print-exec-time'
      ) {
        command.text = content || cmdType.defaultText || ''
      }

      configData.value.commands.push(command)
    }

    // 添加带子命令的命令
    const addCommandWithChildren = (commandStr, childrenArray) => {
      // 首先添加主命令
      addCommandFromString(commandStr)
      const mainCommand =
        configData.value.commands[configData.value.commands.length - 1]

      if (!mainCommand) return

      // 重置子命令数组
      mainCommand.childCommands = [[], []]

      // 解析子命令数组
      // 根据RDTool文档，childrenArray可能是：
      // 1. 单个数组（当命令返回true时执行）
      // 2. 二维数组：[[true分支数组], [false分支数组]]

      if (Array.isArray(childrenArray)) {
        if (childrenArray.length > 0 && Array.isArray(childrenArray[0])) {
          // 二维数组格式
          if (childrenArray[0].length > 0) {
            // true分支
            childrenArray[0].forEach((childCommand) => {
              if (typeof childCommand === 'string') {
                addChildCommandFromString(mainCommand, 0, childCommand)
              }
            })
          }

          if (childrenArray.length > 1 && childrenArray[1].length > 0) {
            // false分支
            childrenArray[1].forEach((childCommand) => {
              if (typeof childCommand === 'string') {
                addChildCommandFromString(mainCommand, 1, childCommand)
              }
            })
          }
        } else {
          // 一维数组格式（全部为true分支）
          childrenArray.forEach((childCommand) => {
            if (typeof childCommand === 'string') {
              addChildCommandFromString(mainCommand, 0, childCommand)
            }
          })
        }
      }
    }

    // 从字符串添加子命令
    const addChildCommandFromString = (
      parentCommand,
      branchIndex,
      commandStr
    ) => {
      // 解析命令类型和选项
      const match = commandStr.match(/^\[([a-z\-]+)(?:\(([^)]+)\))?:\](.*)$/)
      if (!match) return

      const [, typeWithOpts, optionsStr, content] = match
      let type = typeWithOpts
      let options = []

      // 提取选项（如果有）
      if (optionsStr) {
        options = optionsStr.split(',').map((opt) => opt.trim())
        // 从类型中移除选项部分
        const typeMatch = typeWithOpts.match(/^([a-z\-]+)/)
        if (typeMatch) type = typeMatch[1]
      }

      // 创建子命令对象
      const cmdType = getCmdType(type)
      if (!cmdType) return

      const commandId = Date.now() + Math.random()
      const command = {
        id: commandId,
        type: type,
        isBoolean: cmdType.isBoolean || false,
        text: '',
        input1: '',
        input2: '',
        input3: '',
        input4: '',
        options: options,
        childCommands: [[], []],
      }

      // 根据命令类型解析内容
      if (cmdType.noInput) {
        // 无输入的命令，不需要处理内容
      } else if (cmdType.inputType === 'single') {
        command.text = content || cmdType.defaultText || ''
      } else if (cmdType.inputType === 'double') {
        const parts = (content || '').split(',')
        command.input1 = parts[0] || cmdType.defaultText1 || ''
        command.input2 = parts[1] || cmdType.defaultText2 || ''
      } else if (cmdType.inputType === 'upload') {
        const parts = (content || '').split(',')
        command.input1 = parts[0] || cmdType.defaultText1 || ''
        command.input2 = parts[1] || cmdType.defaultText2 || ''
        command.input3 = parts[2] || cmdType.defaultText3 || ''
        command.input4 = parts[3] || cmdType.defaultText4 || ''
      } else if (
        cmdType.inputType === 'record-exec-time' ||
        cmdType.inputType === 'print-exec-time'
      ) {
        command.text = content || cmdType.defaultText || ''
      }

      // 确保父命令的子命令数组存在
      if (!parentCommand.childCommands) {
        parentCommand.childCommands = [[], []]
      }

      if (!parentCommand.childCommands[branchIndex]) {
        parentCommand.childCommands[branchIndex] = []
      }

      parentCommand.childCommands[branchIndex].push(command)
    }

    // 初始化：添加一条默认命令
    addInitialCommand()

    return {
      commandTypes,
      allCommandOptions,
      configData,
      showPassword,
      notification,
      expandedChildCommands,
      formattedConfig,
      getCmdType,
      getAvailableOptions,
      getInputLabel,
      getInputPlaceholder,
      updateCommandDefaults,
      addCommand,
      removeCommand,
      duplicateCommand,
      moveCommandUp,
      moveCommandDown,
      toggleChildCommands,
      addChildCommand,
      removeChildCommand,
      moveChildCommandUp,
      moveChildCommandDown,
      togglePasswordVisibility,
      copyConfig,
      downloadConfig,
      resetConfig,
      showNotification,
      handleFileSelect,
      importConfig
    }
  },
}).mount('#app')
