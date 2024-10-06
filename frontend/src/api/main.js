import { getStorageDir } from "ee-core/ps"

/**
 * 主进程与渲染进程通信频道定义
 * Definition of communication channels between main process and rendering process
 */
const liveStreamApi = {
  list: 'controller.livestream.list',
  findone: 'controller.livestream.findone',
  create: 'controller.livestream.create',
  delete: 'controller.livestream.delete',
  openDirectory:'controller.livestream.openDirectory',
  lastAccessTime:'controller.livestream.lastAccessTime',
  quickAccess:'controller.livestream.quickAccess',
  search: 'controller.livestream.search'

  
}

const workspaceApi = {
  list: 'controller.workspace.list',
  create: 'controller.workspace.create',
  update: 'controller.workspace.update',
  delete: 'controller.workspace.delete',
  setdefault: 'controller.workspace.setdefault',
}

const videoApi = {
  list: 'controller.video.list',
  createWindow: 'controller.video.createWindow',
  selectvideo: 'controller.video.selectvideo',
  savevideo: 'controller.video.savevideo',
}

const settingApi = {
  getMachineId: 'controller.setting.getMachineId',
  defaultSaveDir: 'controller.setting.defaultSaveDir',
  selectFolder: 'controller.setting.selectFolder',
  getRecordSavePath:'controller.setting.getConfig',
  store: 'controller.setting.store',
  getCookie: 'controller.setting.getCookie'
}



const recordApi = {
  list: 'controller.record.list',
  create: 'controller.record.create',
  update: 'controller.record.update',
  delete: 'controller.record.delete',
  recordVideoandAudio: 'controller.record.recordVideoandAudio',
  openVideoDir: 'controller.record.openVideoDir',
  homePage: 'controller.record.homePage',
  start: 'controller.record.startRecording',
  stop: 'controller.record.stopRecording',
  status:'controller.record.status',
  getPullStreamUrl: 'controller.record.getPullStreamUrl'
}

const helperApi={
  createWindow: 'controller.helper.createWindow',
  getMachineId: 'controller.helper.getMachineId'
}
const payApi = {}
const authApi = {}
export {
  liveStreamApi,
  workspaceApi,
  videoApi,
  settingApi,
  payApi,
  authApi,
  // 录制直播项目
  recordApi,
  helperApi
}


