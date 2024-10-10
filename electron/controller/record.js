'use strict';
const {app} = require('electron')
const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');
const {shell,app: electronApp,} = require('electron')
const { startRecording,stopRecording } = require('../utils/record')
const Utils = require('ee-core/utils');
const UtilsHelper = require('ee-core/utils/helper');
const HttpClient = require('ee-core/httpclient');
const Conf = require('ee-core/config')
const path = require('path')
/**
 * example
 * @class
 */
class RecordController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.model = Services.get('record')
  }


  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  // 所有直播间列表
  async list (args) {
    const result = await this.model.allList();
    // Log.info('service result:', result);
    Log.info('recordingProcesses:',global.recordingProcesses)
    return result
  }

  // 添加直播间
  async create (args) {
    const result = await this.model.create(args);
    Log.info('service result:', result);
    return result
  }

  // 更新直播间信息
  async update (args) {
    const result = await this.model.update(args);
    Log.info('service result:', result);
    return result
  }

  // 删除直播间
  async delete (args){
    const result = await this.model.delete(args)
    return result
  }

  // 录制视频、音频
  async recordVideoandAudio(args){
    const result = await this.model.recordVideoandAudio(args)
    return result
  }

  // 主页
  async homePage(args) {
    shell.openExternal(args.url)
  }

  // 打开视频所在目录
  async openVideoDir(args){
    let savepath = ''
    const result = Conf.getValue('recordSavePath')
    if(result && result.savedir){
      savepath = result?.savedir
    }else{
      savepath = app.getPath('downloads')
    }
    const midpath = Conf.getValue('windowsOption').title
    let endPath=''
    if(args.recording==1 || args.recording==2){
      endPath = path.join(savepath,midpath,args.path)
    }else{
      endPath = path.join(savepath,midpath)
    }
    shell.openPath(endPath).then((error) => {
      if (error) {
        console.error(`Failed to open directory: ${error}`);
      }
    });
  }

  // 开始直播录制
  async startRecording(args){
    startRecording(args)
  }

  //  停止录制
  async stopRecording(args){
    stopRecording(args)
  }

  // 获取直播间拉流地址
  async getPullStreamUrl(args){
    const {webcastId} = args
    // const url = 'https://beta.tikhub.io/api/v1/douyin/web/fetch_user_live_videos'
    const url = 'http://localhost:8080/1.json'
    const options = {
      method:'GET',
      data: { webcast_id: webcastId },
      headers:{
        'accept': 'application/json',
        'Authorization': 'Bearer zb4uZjhJ/X8DuAsF/EmGyScy9wQLs6Ty4Kou9jXF6Ep4zg4IIfFj+xntAA=='
      }
    }
    const response = await this.app.curl(url,options);
    const result = JSON.parse(Buffer.from(response.data).toString())

    console.log(result)
    const streamUrl = result.data.data.data[0].stream_url.flv_pull_url.FULL_HD1
    // console.log(      result.data.data.data[0].stream_url.flv_pull_url.FULL_HD1)
    return streamUrl

  }

  async status(args){
    const result = isLive(args.id,cookie)
    return result
  }


 

}

RecordController.toString = () => '[class RecordController]';
module.exports = RecordController;  
