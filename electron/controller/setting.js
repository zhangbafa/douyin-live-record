"use strict";

const { Controller } = require("ee-core");
const Log = require("ee-core/log");
const Services = require("ee-core/services");
const { dialog,app } = require("electron");
const Addon = require("ee-core/addon");
const Ps = require("ee-core/ps");
// const { machineId, machineIdSync } = require("node-machine-id");
const Conf = require('ee-core/config');
const conf = require("ee-core/config/cache");

/**
 * example
 * @class
 */
class SettingController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.model = Services.get('record')
  }

  /**
   * getConfig
   */
  async getConfig(){
    const config = Conf.getValue('recordSavePath')
    if(config?.savedir===''){
      const defaultPath = app.getPath('downloads');
      config.savedir = defaultPath
    }
    return config
  }

  /**
   * 获取用户设置的cookie
   */
  async getCookie(){
    const config = Conf.getValue('recordSavePath')
    return config?.cookie
  }

  /**
   * 新建、保存配置
   */
  async store(args){
    const config = Conf.all()
    config.recordSavePath = args
    Conf.setAll()
    return 1
  }

  /**
   * 获取默认保存目录
   */
  async defaultSaveDir(){
    const userHomeDir = app.getPath('home');
    return userHomeDir
    // const userDownloadsDir = app.getPath('downloads');
    // const appDataDir = app.getPath('userData');
    // console.log(userHomeDir,userDownloadsDir,appDataDir)
    // console.log(Utils.getMAC(),Utils.getPackage())
    // console.log(await Utils.machineId())
  }

  /**
   * 选择目录
   */
  selectFolder() {
    const filePaths = dialog.showOpenDialogSync({
      properties: ["openDirectory", "createDirectory"],
    });
    return filePaths
    if (_.isEmpty(filePaths)) {
      return null;
    }
    return filePaths[0];
  }

  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */
  async getMachineId() {
    let id = await Utils.machineId()
    return id;
  }
}

SettingController.toString = () => "[class SettingController]";
module.exports = SettingController;
