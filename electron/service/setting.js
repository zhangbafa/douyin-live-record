'use strict';

const { Service } = require('ee-core');
const { PrismaClient } = require('@prisma/client')
const { getVideoInfoAndThumbnail } = require('../utils/ffmpeg')
const prisma = new PrismaClient()
/**
 * 示例服务（service层为单例）
 * @class
 */
class SettingService extends Service {

  constructor(ctx) {
    super(ctx);
    let jsondbOptions = {
      driver: 'jsondb'
    }
    this.settingDB =  Storage.connection('record', jsondbOptions);
    this.key = 'config'
  }

  async getConfig(args){
    const key = this.key;
    if (!this.settingDB.db.has(key).value()) {
        this.settingDB.db.set(key, []).write();
    }
    let data = this.settingDB.db
        .get(key)
        .value();
    return data;
  }

  /**
   * 保存
   */
  async create(user) {
    if (!this.settingDB.db.has(this.key).value()) {
        this.settingDB.db.set(this.key, []).write();
    }
    
    const data = this.settingDB.db
        .get(this.key)
        .push(user)
        .write();
    
    return data;
  }

  // 更新直播间信息
  async update(args) {
    const key = this.key;
    const data = this.settingDB.db
        .get(key)
        .find({id: args.id}) // 修改找到的第一个数据，貌似无法批量修改 todo
        .assign(args)
        .write();
    
    return data;
  }


}

SettingService.toString = () => '[class SettingService]';
module.exports = SettingService;