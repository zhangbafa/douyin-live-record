<template>
  <div>
    <div class="draggable"></div>
    <div class="detail" v-if="info">
      <!-- <a-alert closable>
        <template #close-element>
          Close
        </template>
        This is an info alert. 
      </a-alert>-->
      <a-alert type="error" v-show="alterDelete">
        <template #title>
          系统提示
        </template>
        <template #action>
          <a-space>
            <a-button size="small" type="primary" status="danger" @click="handleConfirmDelete">确定</a-button>
            <a-button size="small" type="primary" @click="handleCancelDelete">取消</a-button>
          </a-space>
      </template>
        <template #close-element>
          确认删除
        </template>
        是否确认删除？
      </a-alert>
      <a-card :style="{ width: '98%', margin: '20px auto' }" :title="info.name">
        <template #extra>
          <a-dropdown-button type="primary" @click="handleStartPush">
            <!-- <FolderClosed :size="16" style="margin-right: 8px" /> -->
            <icon-sync :size="16" spin style="margin-right: 8px" v-if="startPush"/>
            <icon-poweroff :size="16" style="margin-right: 8px" v-else/>
            {{ startPush?'正在直播':'开启直播' }}
            <template #content>
              <a-doption @click="handleEditStream">编辑</a-doption>
              <a-doption @click="handleDeleteStream(info.id)">删除</a-doption>
            </template>
          </a-dropdown-button>
        </template>
        <a-row :gutter="16">
          <a-col :md="8" :lg="6" class="col">
            <div class="text-xs text-gray-600">视频帧率（FPS）</div>
            <div class="font-bold">{{ info.fps || "-" }}</div>
          </a-col>
          <a-col :md="8" :lg="6" class="col">
            <div class="text-xs text-gray-600">视频码率</div>
            <div class="font-bold">{{ info.videobps || "-" }}</div>
          </a-col>
          <a-col :md="8" :lg="6" class="col">
            <div class="text-xs text-gray-600">关键帧间距</div>
            <div class="font-bold">{{ info.keyframe || "-" }}</div>
          </a-col>
          <a-col :md="8" :lg="6" class="col">
            <div class="text-xs text-gray-600">视频分辨率</div>
            <div class="font-bold">
              {{ info.outputw || "-" }}x{{ info.outputh || "-" }}
            </div>
          </a-col>
          <a-col :md="8" :lg="6" class="col">
            <div class="text-xs text-gray-600">音频采样率</div>
            <div class="font-bold">{{ info.samplingRate || "-" }}</div>
          </a-col>
          <a-col :md="8" :lg="6" class="col">
            <div class="text-xs text-gray-600">音频码率</div>
            <div class="font-bold">{{ info.audiobps || "-" }}</div>
          </a-col>
          <a-divider></a-divider>
          <a-col :span="24" class="col">
            <div class="text-xs text-gray-600">串流地址</div>
            <div class="font-bold">{{ info.address || "-" }}</div>
          </a-col>
          <a-col :span="24" class="col">
            <div class="text-xs text-gray-600">地址密钥</div>
            <div class="font-bold">{{ maskString(info.secretKey) || "-" }}</div>
          </a-col>
        </a-row>
      </a-card>
      <a-card
        :style="{ width: '98%', margin: '20px auto' }"
        :title="`视频列表`"
        description="拖动排序"
      >
        <template #extra>
          <a-space>
            <a-button @click="handleAddVideo" size="small">添加</a-button>
            <a-button
              type="primary"
              status="danger"
              size="small"
              v-if="showSaveBtn"
              @click="handleSaveVideo"
              >保存</a-button
            >
          </a-space>
        </template>
        <a-row :gutter="16" v-if="info.videos && info.videos.length > 0">
          <VueDraggableNext
            :list="info.videos"
            @end="onDragEnd"
            style="width: 100%"
          >
            <a-col
              :span="24"
              v-for="(item, index) in info.videos"
              :key="item.id"
            >
              <div class="video-container">
                <div class="item">
                  <a-image
                    :src="`file://` + item.thumb"
                    width="50"
                    height="50"
                    style="border-radius: 10px; margin-right: 10px"
                  />
                  <div class="name">
                    <div>{{ item.fileName }}</div>
                    <!-- <span>
                      大小：
                      {{ filesize(item.fileSize, { standard: "jedec" }) }}
                    </span> -->
                  </div>
                </div>
                <div class="action">
                  <div class="item">
                    <a-tooltip content="打开文件所在目录">
                      <FolderClosed
                        :size="18"
                        @click="handlePlay({ path: item.path, type: 'dir' })"
                      />
                    </a-tooltip>
                  </div>
                  <div class="item">
                    <a-tooltip content="打开视频">
                      <Play
                        :size="18"
                        @click="handlePlay({ path: item.path, type: 'video' })"
                      />
                    </a-tooltip>
                  </div>
                  <div class="item">
                    <a-popconfirm content="Are you sure you want to delete?">
                      <Trash2 :size="18" @click="handleDelete(index)" />
                    </a-popconfirm>
                  </div>
                </div>
              </div>
              <a-divider />
            </a-col>
          </VueDraggableNext>
        </a-row>
        <a-empty description="暂无视频" v-else />
      </a-card>
    </div>
  </div>
</template>
<script setup>
import { ref, defineModel, toRaw } from "vue";
import { useRoute, useRouter } from "vue-router";
import { liveStreamApi, videoApi } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";
import { FolderClosed, Play, Trash2 } from "lucide-vue-next";
import { VueDraggableNext } from "vue-draggable-next";
import { Notification, Modal, Button } from "@arco-design/web-vue";

import { filesize } from "filesize";
import { maskString } from "@/utils/strings";
const route = useRoute();
const router = useRouter();
const id = ref(route.query.id);
const info = ref(null);
ipc.invoke(liveStreamApi.findone, { id: id.value }).then((res) => {
  info.value = res;
});

const showSaveBtn = ref(false);
const onDragEnd = () => {
  showSaveBtn.value = true;
};

const handlePlay = (file) => {
  ipc.invoke(liveStreamApi.openDirectory, file).then((res) => {
    if (res.code === 404) {
      alert(res.message);
    }
  });
};

const handleAddVideo = () => {
  ipc.removeAllListeners(videoApi.selectvideo);
  ipc.on(videoApi.selectvideo, (event, result) => {
    if (result.error == 0) {
      info.value.videos.unshift(result.data);
    }
    showSaveBtn.value = true;
  });
  ipc.send(videoApi.selectvideo, toRaw(id.value));
};

const handleDelete = (index) => {
  info.value.videos.splice(index, 1);
};

const handleSaveVideo = () => {
  if (info.value.videos.length <= 0) {
    return false;
  }
  const newData = info.value.videos.map(({ id, ...rest }) => rest);
  ipc
    .invoke(videoApi.savevideo, {
      id: parseInt(info.value.id),
      data: newData,
    })
    .then((response) => {
      console.log(response);
    });
  Notification.info({
    title: "系统提示",
    content: "保存成功!",
  });
};


const refresh = defineModel();
const alterDelete = ref(false)
const deleteId = ref(0)
const handleConfirmDelete=()=>{
  ipc.invoke(liveStreamApi.delete,deleteId.value).then(res=>{
    refresh.value = deleteId.value
    router.push({
      path:'/'
    })
  })
}
const handleCancelDelete=()=>{
  alterDelete.value = false
}
const handleDeleteStream = (id) => {
  deleteId.value = id
  alterDelete.value = true
};

const handleEditStream = ()=>{
  console.log(info.value.id)
  router.push({
    name: "CreatePush",
    query: {
      id: info.value.id,
    },
  });
}

// 开始直播
const startPush = ref(false)
const handleStartPush = ()=>{
  startPush.value = !startPush.value
}
const wait = () => new Promise((resolve) => setTimeout(resolve, 1000));
</script>

<style scoped lang="less">
.draggable {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  user-select: none;
  background-color: rgb(var(--gray-1));
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.detail {
  width: 96%;
  margin: 20px auto;
  text-align: center;
  margin-top: 50px;

  .col {
    margin-bottom: 20px;
    text-align: left;
  }

  .text-xs {
    font-size: 0.8rem;
    color: rgb(var(--gray-7));
  }

  .font-bold {
    font-weight: bold;
    font-size: 1.2rem;
    margin-top: 6px;
  }
}

.video-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  cursor: move;
  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .name {
    font-size: 1rem;
    font-weight: bold;
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    flex-direction: column;
    p {
      font-size: 0.75rem;
      font-weight: normal;
      text-align: left;
      width: 100%;
    }
  }

  .action {
    display: flex;
    justify-content: flex-start;
    align-items: center;

    .item {
      cursor: pointer;
      padding: 8px;
      border-radius: 100px;
      &:hover {
        background-color: rgb(var(--gray-2));
      }
    }
  }
}

:deep(.arco-card-header-title) {
  text-align: left;
}
</style>