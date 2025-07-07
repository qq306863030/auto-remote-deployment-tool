const path = require("path");
const { uploadFile, replacePath } = require("../tools");

async function exec(client, config, command) {
  const arr = parse(command);
  const includeKeyWords = parse2(arr[2]);
  const excludeKeyWords = parse2(arr[3]);
  arr[0] = replacePath(config, 0, arr[0]);
  arr[1] = replacePath(config, 1, arr[1]);
  const res = await uploadFile(
    config,
    client,
    arr[0],
    arr[1],
    includeKeyWords,
    excludeKeyWords
  );
  if (res || res === undefined) {
    return `文件上传完成, 本地路径: ${path.resolve(
      config.localBaseDir,
      arr[0]
    )} 远程路径: ${arr[1]}`;
  }
}
function parse(command) {
  const arr = command.split(",");
  const path1 = arr[0].trim();
  const path2 = arr[1].trim();
  const index = command.lastIndexOf(arr[1]);
  command = command.slice(index + arr[1].length + 1);
  if (~command.indexOf("],")) {
    const arr2 = command.split("],");
    const excludes = arr2[0] + "]";
    const includes = arr2[1].trim() || "[]";
    return [path1, path2, excludes, includes];
  } else if (~command.indexOf(",[")) {
    const arr2 = command.split(",[");
    const excludes = arr2[0].trim() || "[]";
    const includes = "[" + arr2[1].trim();
    return [path1, path2, excludes, includes];
  }

  return [path1, path2, "[]", "[]"];
}

// 解析括号内的字符串
function parse2(str) {
  return str.trim().slice(1, -1).split(",").filter((item => Boolean(item.trim())));
}

module.exports = {
  name: "upload",
  exec,
};
