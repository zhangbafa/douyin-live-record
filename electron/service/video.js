'use strict';

const { Service } = require('ee-core');
const { PrismaClient } = require('@prisma/client')
const { getVideoInfoAndThumbnail } = require('../utils/ffmpeg')
const prisma = new PrismaClient()
/**
 * 示例服务（service层为单例）
 * @class
 */
class VideoService extends Service {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * 根据 ID 获取视频列表
   */
  async list(args){ 
    const { pushid } = args
    const result = await prisma.video.findMany({
        where:{pushStreamId: parseInt(pushid)}
    })
    console.log(result)
    return result
  }

  // 添加视频
  async addVideo(args) {
    const videoInfo = await getVideoInfoAndThumbnail(args);
    return videoInfo
  }

  async savevideo(args) {
    // 先删除后保存
    const a = await prisma.video.deleteMany({
      where:{pushStreamId:args.id}
    })

    console.error(`argssss:${JSON.stringify(args.data)}`)
    
    const createVideos = await prisma.video.createMany({
      data: args.data
    });
    return createVideos
  }
}

VideoService.toString = () => '[class VideoService]';
module.exports = VideoService;