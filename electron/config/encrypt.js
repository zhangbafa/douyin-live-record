module.exports = {
    type: 'bytecode', // 加密类型：bytecode | confusion | strict
    // 需要加密的目录，将废弃，用files替代
    // 替代 directory属性，更强大的文件匹配
    files: [
      'electron/**/*.(js|json)',
      '!electron/config/encrypt.js',
      '!electron/config/nodemon.json',
      '!electron/config/builder.json',
    ],
    fileExt: ['.js'],
    confusionOptions: {}
  };
  