'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');
const {dialog} = require('electron')
const Addon = require('ee-core/addon');
const Ps = require('ee-core/ps');
/**
 * example
 * @class
 */
class VideoController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.db = Services.get('video')
  }


  // 获取配置
  async list (args) {
    const result = await this.model.allList();
    // Log.info('service result:', result);
    Log.info('recordingProcesses:',global.recordingProcesses)
    return result
  }

  /**
   * list
   */
  async list (args) {
    const result = await this.db.list(args)
    Log.info('service result:', result);
    return result
  }

  /**
   * 打开新窗口
   */
  createWindow(args) {
    const { type, content, windowName, windowTitle } = args;
    let contentUrl = null;
    if (type == 'html') {
      contentUrl = path.join('file://', electronApp.getAppPath(), content)
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
      width: 560,
      height: 900,
      //this.electron.mainWindow;
      // parent: top, modal: true,
    }
    const win = Addon.get('window').create(windowName, opt);
    const winContentsId = win.webContents.id;

    // load page
    win.loadURL(contentUrl);

    return winContentsId;
  }

  async savevideo(args) {
    console.log(args)
    const result = await Services.get('video').savevideo(args)
    console.log(result)
    return result
  }

  // 添加视频
  async selectvideo(args,event) {
    const channel = 'controller.video.selectvideo';
    const id = args
    console.log(`arg000s:${JSON.stringify(args)}`)
    const result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'Videos', extensions: ['mp4', 'mkv', 'avi', 'mov', 'wmv'] }
      ]
    });
  
    if (result.canceled) {
      return [];
    }
  
    const promises = result.filePaths.map(async (item) => {
      // return await this.db.addVideo(item);
      const a =  await this.db.addVideo(item);
      // a.error= 22
      a.pushStreamId =  parseInt(id)
      a.path = item

      event.reply(`${channel}`, {error:0,data:a})
    });
  
    const bb = await Promise.all(promises);
    // console.log(bb)
    return {error:1};
  }
}

VideoController.toString = () => '[class VideoController]';
module.exports = VideoController;  