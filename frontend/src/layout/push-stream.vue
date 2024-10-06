<template>
  <a-layout class="layout-demo layout-default">
    <a-layout-sider
      hide-trigger
      :collapsible="false"
      :width="220"
      style="
        position: relative;
        -webkit-app-region: drag;
        -webkit-user-select: none;
      "
      class="draggable layout-sider"

    >
      <div style="margin-top: 10px">
        <!-- <a-input-search :style="{width:'90%',borderRadius:'5px',marginTop: '40px'}" placeholder="搜索"/> -->
        <div style="padding: 10px; margin-top: 40px">
          <!-- <a-input placeholder="search"/> -->
          <a-button long size="large" type="text" @click="handleClick">
            <template #icon>
              <icon-search :size="18" style="margin-top:3px;"/>
            </template>
            搜索
          </a-button>

          <a-button long size="large" type="text" @click="handleCreatePush">
            <template #icon>
              <MonitorPlay :size="18" style="margin-top: 3px"/>
            </template>
            新直播
          </a-button>
        </div>
        <div class="last-live">
          <a-link :hoverable="false">最近直播</a-link>
          <div class="refresh" @click="fetchList()" v-if="spin">
            <icon-refresh :size="18" :spin="spin"/>
          </div>
        </div>
        <div class="push-list">
          <div
            class=""
            style="width: 90%; margin: 0 auto"
            v-for="item in list"
            :key="item.id"
          >
            <a-button long size="large" :type="type==item.id?'primary':'text'" @click="handleDetail(item)">
              <template #icon>
                <icon-drive-file :size="16" />
              </template>
              <span style="font-size: 14px">
                {{ item.name }}
              </span>
            </a-button>
          </div>
        </div>
        
        <div style="position: absolute;bottom: 10px;left:0;width: 100%;">
        <div class="footer" style="width: 90%; margin: 0 auto">
          <a-divider />
          <!-- <div class="set" @click="handleChangeTheme">
              <component :is="dark ? 'icon-moon-fill' : 'icon-sun'" size="22"  strokeLinecap="round" :strokeWidth="4" :style="{color:'rgb(78,89,105)'}"/>
              <div class="item">{{ dark?'夜间':'日间' }}</div>
          </div> -->
          <div class="theme">
            <a-button long type="text" @click="handleSetting">
              <icon-settings size="18" strokeLinecap="round" :strokeWidth="4" />
              <div class="item">系统设置</div>
            </a-button>
          </div>
          </div>
        </div>
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout>
        <a-layout-content>
          <transition>
            <router-view v-slot="{ Component, route }">
              <component :is="Component" :key="route.fullPath" v-model="refreshs"/>
            </router-view>
          </transition>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
  <a-modal
    v-model:visible="visible"
    :closable="false"
    :footer="false"
    :simple="true"
    :width="500"
    @ok="handleOk"
    @cancel="handleCancel"
    class="search-modal"
    modal-class="search-modal"
  >
    <div>
      <a-input
        type="text"
        placeholder="输入你要搜索的内容"
        class="search-input"
        @input="handleInput"
      >
      <template #prefix>
        <icon-search :size="18" />
      </template>
      </a-input>
      <a-divider/>
    </div>
    <div class="list dropdown" ref="dropdown" v-if="searchList && searchList.length">
      {{ searchList.lenght }}
      <div class="item" v-for="item in searchList" :key="item.id">
        <div class="" @click="handleGoDetail(item)">
          <icon-drive-file :size="16" />
          {{ item.name }}
        </div>
      </div>
    </div>
    <a-empty description="暂无数据" v-else />
  </a-modal>
</template>
<script setup>
import { defineComponent, ref, nextTick,onMounted,watch } from "vue";
import { Camera,MonitorPlay } from "lucide-vue-next";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { liveStreamApi } from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";
import { useDark } from "@/utils/dark.js";
import autoAnimate from "@formkit/auto-animate"
const refreshs = ref(0)
const spin = ref(false)
watch(refreshs,()=>{
  spin.value = true
  setTimeout(()=>{
    fetchList()
    spin.value = false
  },1000)
})
const router = useRouter();
const type = ref(0)
const list = ref([]);
const active = ref(0);
const fetchList = () => {
  ipc.invoke(liveStreamApi.list).then((response) => {
    list.value = response;
  });
};

fetchList();

const collapsed = ref(false);
const cacheList = "";
const handlerSearch = () => {
  Message.info("sarch....");
  window.versions.say();
};
const { dark } = useDark();

const handleChangeTheme = () => {
  const theme = document.body.getAttribute("arco-theme");
  if (theme && theme == "dark") {
    document.body.removeAttribute("arco-theme");
    dark.value = false;
  } else {
    document.body.setAttribute("arco-theme", "dark");
    dark.value = true;
  }
};
const handleCreatePush = () => {
  router.push({
    name: "CreatePush",
  });
};

const visible = ref(false);

const handleClick = () => {
  router.push({
    path:'/'
  })
  visible.value = true;
  nextTick(() => {
    document.querySelector(".search-input > .arco-input").focus();
  });
};
const handleOk = () => {
  visible.value = false;
};
const handleCancel = () => {
  visible.value = false;
};

const handleDetail = (item) => {
  type.value = item.id
  router.push({
    path: "/pushdetail",
    query: {
      id: item.id,
    },
  });
};


// search
const searchList = ref();
function debounce(func, wait = 300) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
const handleInput = debounce(() => {
  const value = document.querySelector(".search-input > .arco-input").value;
  if(value){
    ipc.invoke(liveStreamApi.search, { name: value }).then((response) => {
      searchList.value = response;
    });
  }else{
    searchList.value = []
  }
  
}, 300);

const dropdown = ref()
onMounted(() => {
  console.log(dropdown.value)
})

const handleGoDetail = (item) => {
  // autoAnimate(dropdown.value)
  type.value = item.id
  router.push({
    path: "/pushdetail",
    query: { id: item.id },
  });
  visible.value = false;
};

const handleSetting=()=>{
  router.push({
    path: "/recordvideo"
  });
}
</script>
<style scoped lang="less">
body {
  color: var(--color-text-1);
}

.layout-demo {
  height: calc(100vh - 2px);
  border: 1px solid var(--color-border);
}

.layout-sider :deep(.arco-btn) {
  justify-content: flex-start;
}

.layout-sider :deep(.arco-btn-size-large) {
  height: 40px;
  padding: 0 8px;
  font-size: 15px;
  border-radius: var(--border-radius-large);
}

.layout-sider :deep(.arco-btn-text) {
  color: rgb(var(--gray-8));
}

.layout-demo :deep(.arco-layout-sider) {
  background: rgba(var(--gray-2));
  box-shadow: none;
  backdrop-filter: blur(10px);
}

.layout-demo :deep(.arco-layout-sider-light) .logo {
  background: var(--color-fill-2);
}

.layout-demo :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
}

.layout-demo :deep(.arco-layout-footer) {
  height: 48px;
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  line-height: 48px;
}

.layout-demo :deep(.arco-layout-content) {
  background: var(--color-bg-3);
}

.layout-demo :deep(.arco-layout-footer) {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--color-white);
  font-size: 16px;
  font-stretch: condensed;
  text-align: center;
}

.footer :deep(.arco-divider-horizontal) {
  position: relative;
  clear: both;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  margin: 10px 0;
  border-bottom: 1px solid var(--color-neutral-3);
}

.ele-menu {
  text-align: left;
  margin-top: 25px;
  -webkit-app-region: no-drag;
  position: relative;
  width: 90%;
  padding-left: 8px;
  margin: 10px auto;
  box-sizing: border-box;
  padding: 10px;
  color: rgb(var(--gray-9));
}

.ele-menu:hover {
  cursor: pointer;
  background-color: rgb(var(--gray-4));
  color: rgba(var(--gray-10));
  border-radius: 6px;
}

.ele-menu .item {
  font-size: 15px;
  font-weight: 400;
  margin-top: 3px;
  font-weight: bold;
  margin-left: 8px;
}

.ele-menu a {
  text-decoration: none;
  color: rgb(var(--gray-8));
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
}

.ele-menu.active .arco-icon,
.ele-menu.active .item {
  color: rgb(var(--primary-6));
}

.ele-menu-hover:hover .arco-icon,
.ele-menu-hover:hover .item {
  color: rgb(var(--primary-6));
}

.ele-footer-menu {
  position: absolute;
  bottom: 30px;
  text-align: center;
  width: 100%;
}

.last-live {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  padding-left: 20px;
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .refresh{
    margin-right: 10px;
    color: rgb(var(--gray-8));
    cursor: pointer;
  }
}

.push-list{
  height: calc(100vh - 250px);
  overflow-y: auto; 
  padding-bottom: 0px;
}

.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  flex-direction: column;
}

.setting .set,
.setting .theme {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* 设置整个滚动条的背景色 */
::-webkit-scrollbar {
  width: 5px;
  /* 滚动条的宽度 */
  background-color: rgb(var(--gray-2));
  /* 滚动条的背景色 */
}

/* 设置滚动条滑块的背景色 */
::-webkit-scrollbar-thumb {
  background-color: #999;
  /* 滑块的背景色 */
  border-radius: 6px;
  /* 滑块的圆角 */
}

/* 设置滚动条滑块在悬停时的背景色 */
::-webkit-scrollbar-thumb:hover {
  background-color: #555;
  /* 滑块悬停时的背景色 */
}

.search-input {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 1rem;
  /* background-color: rgb(var(--gray-1)); */
  border: none;
  .list {
    height: 400px;
    background-color: red;
  }
}

.search-modal {
  .arco-input-wrapper{
    background-color: transparent;
  }
  :deep(.arco-divider-horizontal){
    padding: 10px 0;
  }
  .list {
    padding: 8px;
    min-height: 20vh;
    max-height: 90vh;
    overflow-y: auto;
  }
  .item{
    height: 40px;
    line-height: 40px;
    
    border-bottom: 1px solid rgb(var(--gray-2));
    margin-bottom: 10px;
    :hover{
      cursor: pointer;
      background-color: rgb(var(--gray-2));
    }
    div{
      padding-left: 10px;
      border-radius: 3px;
    }
  }
}

</style>

<style>
.search-modal .arco-modal-body {
    padding: 0;
}

.search-modal .arco-modal-simple{
    padding: 20px 0;
}

.search-modal .arco-modal {
  border-radius: 20px
}
</style>
