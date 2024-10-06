'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');

/**
 * example
 * @class
 */
class WorkspaceController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.model = Services.get('workspace')
  }


  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  /**
   * test
   */
  async list (args) {
    const result = await this.model.list();
    Log.info('service result00:', result);
    return result
  }
  async create (args) {
    const result = await this.model.createWorkspace(args);
    Log.info('service result:', result);
    return result
  }
  async update (args) {
    const result = await this.model.updateWorkspace(args);
    Log.info('service result:', result);
    return result
  }
  async delete (args){
    const result = await this.model.delete(args)
    return result
  }
  async setdefault (args) {
    const result = await this.model.setDefaultSpace(args)
    return result
  }
}

WorkspaceController.toString = () => '[class WorkspaceController]';
module.exports = WorkspaceController;  