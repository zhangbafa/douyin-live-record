<template>
  <div class="layout-push-stream">
  <a-layout>
      <a-layout-content>
          <div class="draggable">
            kkk
          </div>
          <div style="text-align: left;" :style="{padding: '0px 16px'}">
            <div class="title">
              <h3>推送列表</h3>
              <div style="font-weight: bold;margin-left: 15px">
                <a-button shape="circle" size="mini">
                  <icon-plus :size="14" @click="handleCratePush"/>
                </a-button>
              </div>
            </div>
            <a-list>
              <a-list-item v-for="(item,idx) in list" :key="idx">
                <a-list-item-meta
                  :title="item.name"
                >
                  <!-- <template #description>
                    <div class="description">
                      <div class="item">视频帧率（FPS）<br/> <span>{{ item.fps }}</span></div>
                      <div class="item">视频码率<br/><span>{{ item.videobps }}</span></div>
                      <div class="item">关键帧间距<br/><span>{{ item.keyframe }}</span></div>
                      <div class="item">音频采样率<br/><span>{{ item.sampling_rate }}</span></div>
                      <div class="item">音频码率<br/><span>{{ item.audiobps }}</span></div>
                      <div class="item">视频分辨率<br/><span>{{ item.output_w }}x{{ item.output_h }}</span></div>
                      <div class="item">推送时间<br/><span>{{ item.push_datetime_range }}</span></div>
                    </div>
                  </template> -->
                  <template #avatar>
                    <icon-tiktok-color size="30"/>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-switch v-model="item.is_enabled" size="mini" @change="handleChangeEnabled(item)" :beforeChange="handleChangeIntercept"/>
                  <icon-edit size="16"/>
                  <a-popconfirm position="lt" content="是否确认删除?" okText="确认" cancelText="取消" @ok="handleDelete(item.id)">
                    <icon-delete size="16"/>
                  </a-popconfirm>
                  <a-tooltip content="管理视频">
                    <icon-plus size="16" @click="handleManage(item)"/>
                  </a-tooltip>
                </template>
              </a-list-item>
            </a-list>
          </div>
      </a-layout-content>
  </a-layout>
</div>
<a-modal v-model:visible="visible">
    
    <div>
      <!-- <Video/> -->
    </div>
  </a-modal>
</template>

<script setup>
import { ref,reactive,toRaw } from 'vue'
import { listStramApi,videoApi} from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
import {useRouter,useRoute} from 'vue-router'
import { Notification } from '@arco-design/web-vue';
import Video from './managevideo.vue'
const router = useRouter()
const visible = ref(false)
// 新增列表
const handleCratePush = ()=> {
  router.push({
    path:'/createpush'
  })
}

// 获取列表-不分页
const list = ref([])
const fetchList = ()=> {
  ipc.invoke(listStramApi.list,'').then(response => {
    list.value = response
  })
}
fetchList()

const handleChangeIntercept = async (v) => {
    console.log(v)
}

const handleChangeEnabled = (value)=>{
  ipc.invoke(listStramApi.enabled,toRaw(value)).then(res=>{
    
  })
}
// 删除
const handleDelete = (id)=> {
  Notification.info({
      title: '系统提示',
      content: '删除成功!',
  })
  ipc.invoke(listStramApi.delete,id).then(res=>{
    fetchList()
  })
}

// 管理视频
const dark = ref(0)
const handleManage = (item)=> {
  // visible.value = true
  const theme = document.body.getAttribute('arco-theme')
  if(theme && theme == 'dark'){
    dark.value = 1
  }else{
    dark.value = 0
  }
  console.log(toRaw(dark.value))
  ipc.invoke(videoApi.createWindow, {
          type: 'vue',
          content: `#/managevideo?id=${item.id}&dark=${toRaw(dark.value)}`,
          windowName: 'window-vue',
          windowTitle: '管理视频'
        },).then(r => {
        console.log(r);
  })
}
</script>

<style scoped lang="less">
.layout-push-stream :deep(.arco-layout-sider){
  width: 50px;
  height: 100vh;
  box-shadow: none;
  border-right: 1px solid  rgb(var(--gray-3));
  // background-color: rgb(var(--gray-2));
  overflow: hidden;
  overflow: visible;
}
.arco-layout-content{
  padding-bottom: 30px;
}
:deep(.arco-list-item-meta-title){
  text-align: left;
}
.draggable{
  -webkit-app-region: drag;
  -webkit-user-select: none;
  user-select: none;
  // background-color: rgb(var(--gray-2));
  height: 40px;
}
.title{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color:rgb(var(--gray-10));
  margin-bottom: 10px;
}
.header{
  height: 46px;
  display: flex;
  justify-content: space-between;
}

.description{
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // width: 80%;
  .item{
    font-size: 10px;
    padding: 6px;
    margin-right: 15px;
  }
  span{
    font-weight: bold;
    font-size: 14px;
  }
}

.video-list {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: auto;
  width: 100%;
  
  .item{
    width: 220px;
    height: 150px;
    flex-shrink: 0;
    background-color: rgb(var(--gray-2));
  }
}
</style>