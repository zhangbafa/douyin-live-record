<template>
    <div class="header-action">
        <a-button  @click="handleSelectVideo">选择视频文件</a-button>
        <div class="info">
            <a-button type="primary" @click="handleSubmit">确定</a-button>
        </div>
    </div>
    <!-- <img src="/Users/zhang1/Downloads/韩国综艺_thumbnail.jpg" alt=""> -->
    <div class="content">
        <a-row :gutter="20">
            <VueDraggableNext :list="list" @end="onDragEnd" style="display: flex;justify-content: flex-start;flex-wrap: wrap;box-sizing: border-box;">
            <a-col :span="12" v-for="(item,index) in list" :key="item.fileName">  
                <a-card style="margin-bottom: 20px;cursor:move;">
                    <h4>{{ item.fileName }} </h4>
                    <div style="margin-top: 10px;cursor: pointer;"><icon-delete size="20" @click="handleDelete(index)"/></div>
                </a-card>
            </a-col>
        </VueDraggableNext>
        </a-row>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, watch,toRaw } from 'vue';
import { videoApi } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';
import { VueDraggableNext } from 'vue-draggable-next'
import { Notification } from '@arco-design/web-vue';


const route = useRoute();
const id = ref(route.query.id);
const dark = route.query.dark
const list = ref([])
dark==1?document.body.setAttribute('arco-theme', 'dark'):document.body.removeAttribute('arco-theme');

// 获取视频列表
ipc.invoke(videoApi.list,{pushid:id.value}).then(res=>{
    list.value = res
})
// delete
const handleDelete = (index)=> {
    list.value.splice(index, 1);
}

// submit
const handleSubmit = () =>{
    if(list.value.length<=0){
        return false
    }
    console.log(list.value)
    // return false
    ipc.invoke(videoApi.savevideo,{id:parseInt(id.value),data:toRaw(list.value)}).then(response => {
        console.log(response)
    }) 
    Notification.info({
      title: '系统提示',
      content: '保存成功!',
    })

    setTimeout(() => {
        window.close()
    }, 1000);

   
}
const handleSelectVideo = ()=>{
    ipc.removeAllListeners(videoApi.selectvideo);
    ipc.on(videoApi.selectvideo, (event, result) => {
        if(result.error==0){

            list.value.push(result.data)
        }
    })
    ipc.send(videoApi.selectvideo, toRaw(id.value));
}

const onDragEnd=()=> {
    console.log(list.value)
}
</script>

<style scoped lang="less">
.header-action {
    background-color: rgb(var(--gray-2));
    height: 60px;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    position: sticky;
    top:0;
    left:0;
    width: 100%;
    z-index: 100;
    box-sizing: border-box;
}
.content{
    padding: 20px;
}
video {
    width: 100%;
    height: 100%;
}
</style>