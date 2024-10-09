'use strict';

/**
 * 开发环境配置，覆盖 config.default.js
 */
module.exports = (appInfo) => {
  const config = {};

  /**
   * 开发者工具
   */
  config.openDevTools = {
    mode: 'undocked'
  };

  /**
   * 应用程序顶部菜单
   */
  config.openAppMenu = true;

  /**
   * jobs
   */
  config.jobs = {
    messageLog: true
  };   

  /**
   * 录制视频配置
   */
  config.recordSavePath={
    savedir: "",
    segment: false,
    segmentDuration: 10,
    cookie: "",
  }

  return {
    ...config
  };
};
