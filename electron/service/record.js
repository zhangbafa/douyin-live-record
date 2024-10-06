'use strict';

const { Service } = require('ee-core');
const { PrismaClient } = require('@prisma/client')
const { getVideoInfoAndThumbnail } = require('../utils/ffmpeg')
// const prisma = new PrismaClient()
const Storage = require('ee-core/storage'); 

/**
 * 示例服务（service层为单例）
 * @class
 */
class RecordService extends Service {

  constructor(ctx) {
    super(ctx);

    let jsondbOptions = {
      driver: 'jsondb'
    }
    this.recordDB =  Storage.connection('record', jsondbOptions);
    this.key = 'list'
  }

  // 全部直播间列表
  async allList(args){
    const key = this.key;
    if (!this.recordDB.db.has(key).value()) {
        this.recordDB.db.set(key, []).write();
    }
    let data = this.recordDB.db
        .get(key)
        .value();
    
    // if (_.isEmpty(data)) {
    //     data = []
    // }
    
    return data;
  }

  // 添加直播间
  async create(user) {
    const key = 'list'
    if (!this.recordDB.db.has(key).value()) {
        this.recordDB.db.set(key, []).write();
    }
    
    const data = this.recordDB.db
        .get(key)
        .push(user)
        .write();
    
    return data;
  }

  // 更新直播间信息
  async update(args) {
    const key = this.key;
    const data = this.recordDB.db
        .get(key)
        .find({id: args.id}) // 修改找到的第一个数据，貌似无法批量修改 todo
        .assign({islive: args.islive})
        .write();
    
    return data;
  }

  // 删除直播间
  async delete(args) {
    const key = this.key
    const data = this.recordDB.db
        .get(key)
        .remove({id: args.id})
        .write();
    
    return data;
  }

  // 检测是否开播
  async islive(args) {
    return 0
  }

  // 录制音频或者视频
  async recordVideoandAudio(args){
    const key = this.key;
    console.log(args)
    const data = this.recordDB.db
        .get(key)
        .find({id: args.id}) // 修改找到的第一个数据，貌似无法批量修改 todo
        .assign({recording: args.type})
        .write();
    
    return data;
  }

  // 访问直播间主页
  async homePage(args) {
    return 0
  }

  // 打开视频所在目录
  async openVideoDir(args){
    return 0
  }

  
}

RecordService.toString = () => '[class RecordService]';
module.exports = RecordService;