<template>
  <div style="position: relative">
    <!-- <div class="draggable">
        小米直播录屏
    </div> -->
    <div class="container">
      <a-tabs default-active-key="1" :animation="true" v-model="activeKey">
        <template #extra>
          <a-button
            style="margin-right: 10px"
            size="mini"
            @click="handleSetting"
            >系统设置</a-button
          >
        </template>
        <a-tab-pane key="1" title="主播列表" style="box-sizing: border-box">
          <div class="live-container">
            <div class="item" v-for="item in zhuboList" :key="item.id">
              <a-dropdown
                trigger="contextMenu"
                alignPoint
                :style="{ display: 'block', width: '220px' }"
              >
                <div class="item-meta" style="width: 80%">
                  <div>
                    <a-avatar shape="square" v-if="item.avatar">
                      <img alt="avatar" :src="item.avatar" />
                    </a-avatar>
                    <icon-tiktok-color :size="40" v-else />
                  </div>
                  <div class="nickname-title">
                    <div class="nickname">
                      {{ item.name }}
                      <template v-if="item.islive === 2">
                        <a-badge
                          text="直播中"
                          :dot-style="{
                            transform: 'scale(0.8)',
                            marginTop: '4px',
                            backgroundColor: 'green',
                          }"
                        />
                      </template>
                      <template v-else-if="item.islive === 4">
                        <a-badge
                          text="已下播"
                          :dot-style="{
                            transform: 'scale(0.8)',
                            marginTop: '4px',
                          }"
                        />
                      </template>
                      <template v-else>
                        <a-badge
                          text="未检测"
                          :dot-style="{
                            transform: 'scale(0.8)',
                            marginTop: '4px',
                            backgroundColor: 'gray',
                          }"
                        />
                      </template>
                      <template v-if="item.recording === 1">
                        <a-badge
                          text="音频录制中"
                          :dot-style="{
                            transform: 'scale(0.8)',
                            marginTop: '4px',
                            backgroundColor: 'green',
                          }"
                        />
                      </template>
                      <template v-if="item.recording === 2">
                        <a-badge
                          text="视频录制中"
                          :dot-style="{
                            transform: 'scale(0.8)',
                            marginTop: '4px',
                            backgroundColor: 'green',
                          }"
                        />
                      </template>

                      <template v-if="checkLiveId === item.id">
                        <icon-refresh
                          :size="14"
                          spin
                          style="margin-left: 8px"
                        />
                      </template>

                      <!-- 
                      <a-badge text="录制中" :dot-style="{transform:'scale(0.8)',backgroundColor:'green'}"/> -->
                    </div>
                    <div class="title">
                      {{ item.title }}
                    </div>
                  </div>
                </div>
                <div class="action">
                  <div class="breathing-light">
                    <a-button
                      v-if="item.recording > 0"
                      size="mini"
                      @click="handleStopRecord(item)"
                      >停止录制</a-button
                    >
                  </div>
                </div>

                <template #content>
                  <a-doption @click="handleisLive(item)">
                    <template #icon>
                      <Rocket :size="18" />
                    </template>
                    <template #default>检测开播</template>
                  </a-doption>
                  <a-divider style="margin: 0" />
                  <a-doption @click="handleStartRecord(item, 'audio')">
                    <template #icon>
                      <icon-music :size="18" />
                    </template>
                    <template #default>录制音频</template>
                  </a-doption>
                  <a-doption @click="handleStartRecord(item, 'video')">
                    <template #icon>
                      <icon-video-camera :size="18" />
                    </template>
                    <template #default>录制视频</template>
                  </a-doption>
                  <a-divider style="margin: 0" />
                  <a-doption @click="handleHomePage(item)">
                    <template #icon>
                      <icon-home :size="18" />
                    </template>
                    <template #default>访问主页</template>
                  </a-doption>

                  <a-doption @click="handleOpenDirname(item)"
                    ><template #icon>
                      <icon-folder :size="18" />
                    </template>
                    <template #default>打开视频目录</template>
                  </a-doption>
                  <a-divider style="margin: 0" />
                  <a-doption style="color: red" @click="handleDeleteLive(item)">
                    <template #icon>
                      <icon-delete :size="18" />
                    </template>
                    <template #default>移除</template></a-doption
                  >
                </template>
              </a-dropdown>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane
          key="2"
          title="添加主播"
          style="padding: 15px; box-sizing: border-box"
        >
          <a-form
            ref="formRef"
            :size="form.size"
            :model="form"
            @submit="handleSubmit"
            layout="vertical"
          >
            <a-form-item field="content" label="直播间地址">
              <a-textarea
                placeholder="直播间地址 每行一个"
                :auto-size="{
                  minRows: 15,
                  maxRows: 18,
                }"
                :rules="[{ required: true, message: '不能为空' }]"
                :validate-trigger="['change', 'input']"
                v-model="form.content"
              />
            </a-form-item>
            <a-row :gutter="20">
              <a-col :span="16">
                <a-button html-type="submit" type="primary" long>确定</a-button>
              </a-col>
              <a-col :span="8">
                <a-button long @click="$refs.formRef.resetFields()"
                  >重置</a-button
                >
              </a-col>
            </a-row>
          </a-form>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRaw } from "vue";
import { useRouter } from "vue-router";
import { Notification } from "@arco-design/web-vue";
import { Rocket, CirclePause, Video, SquarePlay, Music } from "lucide-vue-next";
import stickybits from "stickybits";
import { ipc } from "@/utils/ipcRenderer";
import { recordApi, helperApi,settingApi } from "@/api/main";
import { cookie, isLive } from "@/utils/islive";

const router = useRouter();
const activeKey = ref("2");
onMounted(() => {
  stickybits(".arco-tabs-nav", { stickyBitStickyOffset: 0 });
});
// 首先获取用户抖音的cookie
const userCookie = ref('')
ipc.invoke(settingApi.getCookie).then(res=>{
  userCookie.value = res
  Notification.info({
      title: "系统提示",
      content: "请现在系统设置中填写抖音Cookie",
      position: "bottomRight",
    });
})
// 添加直播间
const form = reactive({
  content: "",
});
const handleSubmit = ({ values, errors }) => {
  if (values.content) {
    // console.log("values:", values, "\nerrors:", errors);
    const link = values.content.split("\n");

    link.forEach((element) => {
      const roomID = element.match(/\d+/)[0];
      isLive(roomID, cookie).then((res) => {
        console.log(res);
        console.log(typeof res.status);
        const data = {
          id: roomID,
          name: res.nickname,
          islive: res.status === "2" ? true : false,
          avatar: res.avatar,
          title: res.title,
          recording: 0,
        };
        zhuboList.value.unshift(data);
        ipc.invoke(recordApi.create, data).then((res) => {
          console.log(res);
        });
      });
    });
    Notification.info({
      title: "系统通知",
      content: "添加成功",
      position: "bottomRight",
    });
  }
};

// 直播间列表管理
// 获取列表
const zhuboList = ref();
const fetchList = () => {
  ipc.invoke(recordApi.list).then((res) => {
    zhuboList.value = res;
  });
};
fetchList();
// 更新直播间信息
// 检测开播
const checkLiveId = ref(0);
const handleisLive = (item) => {
  checkLiveId.value = item.id;
  isLive(item.id, cookie).then((res) => {
    const index = zhuboList.value.findIndex((zhubo) => zhubo.id === item.id);
    if (res.status === "2") {
      zhuboList.value[index].islive = 2;
    } else {
      zhuboList.value[index].islive = 4;
    }
    checkLiveId.value = 0;
  });
};
// 录制音频/视频
const handleStartRecord = async (item, type) => {
  if (item.islive !== 2) {
    Notification.info({
      title: "主播已结束直播",
      content: "重新检测,以更新主播直播间状态",
      position: "bottomRight",
    });
    return false;
  }
  if (item.recording > 0) {
    Notification.info({
      title: "系统通知",
      content: "正在录制，请先停止",
      position: "bottomRight",
    });
    return false;
  }
  
  
  const pullStream = await isLive(item.id, cookie)
  let pullStreamUrl = ''
  if(pullStream.streamUrl){
     pullStreamUrl = pullStream.streamUrl.flv_pull_url.HD1
  }else{
    Notification.info({
      title: "系统通知",
      content: "未能获取直播流，请设置Cookie或稍后再试",
      position: "bottomRight",
    });
    return false;
  }
  // const pullStreamUrl = await ipc.invoke(recordApi.getPullStreamUrl,{webcastId:item.id})
  console.log(pullStreamUrl)
  const recordType = type === "audio" ? 1 : 2;
  const index = zhuboList.value.findIndex((zhubo) => zhubo.id === item.id);
  zhuboList.value[index].recording = recordType;
  // todo 获取直播间地址∆
  const liveInfo = {
    streamUrl:pullStreamUrl,
    recordType: type,
  };
  const params = Object.assign(item, liveInfo);
  console.log(toRaw(params))
  ipc.invoke(recordApi.start, toRaw(params));
};

const handleStopRecord = (item) => {
  const index = zhuboList.value.findIndex((zhubo) => zhubo.id === item.id);
  zhuboList.value[index].recording = 0;
  ipc.invoke(recordApi.stop, toRaw(item));
};
// 打开直播间主页
const handleHomePage = (item) => {
  const url = `https://live.douyin.com/${item.id}`;
  ipc.invoke(recordApi.homePage, { url: url });
};
// 打开视频所在目录
const handleOpenDirname = (item) => {
  const path = `/Users/zhang1/Downloads`;
  ipc.invoke(recordApi.openVideoDir, { path: path });
};
// 删除直播间
const handleDeleteLive = (item) => {
  ipc.invoke(recordApi.delete, { id: item.id }).then((res) => {
    fetchList();
  });
};

const handleSetting = () => {
  ipc.invoke(helperApi.createWindow, {
    type: "vue",
    content: "#/record/setting",
    windowName: "window-vue",
    windowTitle: "系统设置",
    width: 400,
    height: 650
  });
};
</script>

<style scoped lang="less">
.draggable {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  user-select: none;
  background-color: rgb(var(--gray-1));
  height: 50px;
  line-height: 50px;
  font-weight: 800;
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
}

.arco-tabs {
  overflow: visible;
}

:deep(.arco-tabs-nav) {
  background-color: rgb(var(--gray-1));
  z-index: 1000;
}
:deep(.arco-tabs-content) {
  padding: 0;
}

.live-container {
  padding: 10px;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral-3);
    cursor: pointer;
    margin-right: auto;
    &:hover {
      background-color: rgb(var(--arcoblue-2));
      transition: background-color 0.2s;
    }
  }
  .item-meta {
    display: flex;
    justify-content: flex-start;
    padding: 15px 8px;

    .nickname-title {
      margin-left: 15px;
      text-align: left;
      .nickname {
        font-weight: bold;
        display: flex;
        align-items: center;
      }
      .title {
        font-weight: 300;
        font-size: 12px;
        margin-top: 8px;
      }
    }
  }
  .action {
    padding-right: 8px;
  }
}

.breathing-light {
  color: rgb(var(--primary-6));
  font-size: 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  // width: 3px;
  // height: 15px;
  // animation: breathingLight 1.6s infinite;
}
@keyframes breathingLight-1 {
  0% {
    transform: scale(1);

    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  75% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.5;
  }
}
.sss {
  .arco-badge-text {
    background: yellow;
  }
}
</style>

<style>
.arco-dropdown-list-wrapper {
  max-height: inherit;
}
</style>
// http://pull-hs-f5.flive.douyincdn.com/third/stream-404202007733469867.flv?expire=1728725466&sign=45f9e4c37d787d4d7f73f33ec66d7f37&volcSecret=45f9e4c37d787d4d7f73f33ec66d7f37&volcTime=1728725466&major_anchor_level=common
// http://pull-hs-f5.flive.douyincdn.com/third/stream-404202007733469867.flv?expire=1728725584&sign=84b3247f1deb0afe3cc5e016557f8dc0&volcSecret=84b3247f1deb0afe3cc5e016557f8dc0&volcTime=1728725584&major_anchor_level=common