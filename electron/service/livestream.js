"use strict";

const { Service } = require("ee-core");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
/**
 * 示例服务（service层为单例）
 * @class
 */
class LiveStreamService extends Service {
  constructor(ctx) {
    super(ctx);
  }

  /**
   * list
   */
  async list(args) {
    const pushStream = await prisma.pushStream.findMany({
      where: { isDelete: false },
      include: {
        videos: true,
        workspace: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return pushStream;
  }

  async search(args) {
    console.log(`search:${JSON.stringify(args)}`)
    const pushStream = await prisma.pushStream.findMany({
      where: {
        isDelete: false,
        name: {
          contains: args.name, // 相当于 SQL: WHERE name LIKE '%john%'
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return pushStream;
  }

  async findone(args) {
    prisma.pushStream.findFirst;
    const pushStream = await prisma.pushStream.findFirst({
      where: { id: parseInt(args.id) },
      include: {
        videos: true,
        workspace: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return pushStream;
  }

  /**
   * 添加推送列表
   */
  async create(args) {
    let newPushStream 
    try {
      args.pushDatetimeRange = JSON.stringify(args.pushDatetimeRange);
      if(args.id){
         newPushStream = await prisma.pushStream.update(
        {
          where: { id: args.id },
          data: args,
        });
      }else{
         newPushStream = await prisma.pushStream.create({
          data: args,
        });
      }
      
      return { success: true, data: newPushStream };
    } catch (error) {
      console.error("Error creating push stream:", error);
      return { success: false, error: error.message };
    }
  }

  // todo
  // 修改列表
  // 删除列表
  async delete(args) {
    const result = await prisma.pushStream.update({
      where: { id: args },
      data:{isDelete:true}
    });
    return result;
  }

  // 启用/关闭列表
  async enabled(args) {
    const result = await prisma.pushStream.update({
      where: { id: args.id },
      data: { is_enabled: args.is_enabled },
    });
    return result;
  }

  async lastAccessTime(args) {
    const result = await prisma.pushStream.update({
      where: { id: args.id },
      data: { lastAccessTime: args.lastAccessTime },
    });
    return result;
  }
  //quickAccess
  async quickAccess(args) {
    const result = await prisma.pushStream.update({
      where: { id: args.id },
      data: { quickAccess: args.quickAccess },
    });
    return result;
  }
}

LiveStreamService.toString = () => "[class LiveStreamService]";
module.exports = LiveStreamService;
