'use strict';

const { Service } = require('ee-core');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
/**
 * 示例服务（service层为单例）
 * @class
 */
class WorkSpaceService extends Service {

  constructor(ctx) {
    super(ctx);
  }

  /**
   * 工作空间列表
   */
  async list(args) {
    const pushStream = await prisma.workspace.findMany({
      where:{
        isDelete:false
      }
    });
    return pushStream
  }

  /**
   * 添加工作空间
   */
  async createWorkspace(args) {
    const workspace = await prisma.workspace.create({
      data: args,
    });
    return workspace;
  }
  
  // 更新
  async updateWorkspace(args) {
    //workspaceId, name, description
    const { id,name,description,color} = args
    const workspace = await prisma.workspace.update({
      where: {
        id
      },
      data: {
        name,
        color,
        description
      },
    });
    return workspace;
  }

  
  // 删除工作空间
  async delete(args) {
    const {id} = args
    const result = await prisma.workspace.update({
      where:{id},
      data: {
        isDelete: true
      }
    })
    return result
  }

  // 设置为默认空间
  async setDefaultSpace(args) {
    const { id } = args
    // 默认的改为非默认
    const result1 = await prisma.workspace.updateMany({
      where:{isDefault: true},
      data: {
        isDefault: false
      }
    })
    // 设置新的
    const result2 = await prisma.workspace.update({
      where:{id:id},
      data: {
        isDefault: true
      }
    })
    return result2
  }
}

WorkSpaceService.toString = () => '[class WorkSpaceService]';
module.exports = WorkSpaceService;