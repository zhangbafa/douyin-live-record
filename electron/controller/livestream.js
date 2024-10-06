'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');
const {dialog,shell,  app: electronApp} = require('electron')
const Addon = require('ee-core/addon');
const Ps = require('ee-core/ps');
const path = require('path')
const fs = require('fs')


/**
 * example
 * @class
 */
class LiveStreamController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.db = Services.get('livestream')
  }


  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  async openDirectory(directoryPath,type='dir'){
    let file = directoryPath.path
    if(directoryPath.type=='dir'){
      file = path.dirname(directoryPath.path)
    }
    if(!fs.existsSync(file)){
      return {code:404,message:'文件不存在'}
    }
    shell.openPath(file).then((error) => {
      if (error) {
        console.error(`Failed to open directory: ${error}`);
      }
    });
    return true
  }
  /**
   * list
   */
  async list (args) {
    const result = await this.db.list()
    return result
  }

  async search (args) {
    const result = await this.db.search(args)
    return result
  }


  /**
   * findone
   */
  async findone(args){
    const result = await this.db.findone(args)
    return result
  }
  /**
   * create
   */
  async create(args) {
    const result = await this.db.create(args)
    return result
  }
  /**
   * create
   */
  async selectvideo(args,event) {
    const channel = 'controller.push.selectvideo';
    const id = args
    console.log(`args:${JSON.stringify(args)}`)
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
  
    // const bb = await Promise.all(promises);
    // console.log(bb)
    return {error:1};
  }

  /**
   * delete
   */
  async delete (args) {
    const result = await this.db.delete(args)
    // Log.info('service result:', result);
    return result
  }

  /**
   * enabled
   */
  async enabled (args) {
    const result = await this.db.enabled(args)
    // Log.info('service result:', result);
    return result
  }

  async lastAccessTime (args) {
    const result = await this.db.lastAccessTime(args)
    // Log.info('service result:', result);
    return result
  }

  async quickAccess (args) {
    const result = await this.db.quickAccess(args)
    // Log.info('service result:', result);
    return result
  }

   
}

LiveStreamController.toString = () => '[class LiveStreamController]';
module.exports = LiveStreamController;  