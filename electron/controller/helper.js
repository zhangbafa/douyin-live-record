"use strict";

const { Controller } = require("ee-core");
const Log = require("ee-core/log");
const Services = require("ee-core/services");
const { dialog,app } = require("electron");
const Addon = require("ee-core/addon");
const Conf = require('ee-core/config');
const Utils = require('ee-core/utils');
const Ps = require("ee-core/ps");

/**
 * example
 * @class
 */
class HelperController extends Controller {
  constructor(ctx) {
    super(ctx);
  }

  createWindow(args) {
    const { type, content, windowName, windowTitle,width=360,height=660 } = args;
    let contentUrl = null;
    if (type == 'html') {
      contentUrl = path.join('file://', app.getAppPath(), content)
    } else if (type == 'web') {
      contentUrl = content;
    } else if (type == 'vue') {
      let addr = 'http://localhost:8080'
      if (Ps.isProd()) {
        const mainServer = Conf.getValue('mainServer');
        if (Conf.isFileProtocol(mainServer)) {
          addr = mainServer.protocol + path.join(Ps.getHomeDir(), mainServer.indexPath);
        } else {
          addr = mainServer.protocol + mainServer.host + ':' + mainServer.port;
        }
      }

      contentUrl = addr + content;
    } else {
      // some
    }

    console.log('contentUrl: ', contentUrl);
    let opt = {
      title: windowTitle,
      width: width,
      height: height,
      modal: true,
    }
    const win = Addon.get('window').create(windowName, opt);
    const winContentsId = win.webContents.id;

    // load page
    win.loadURL(contentUrl);

    return winContentsId;
  }


  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */
  async getMachineId() {
    let machineId = await Utils.machineIdSync();
    return machineId;
  }
}

HelperController.toString = () => "[class HelperController]";
module.exports = HelperController;
