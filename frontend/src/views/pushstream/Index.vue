<template>
  <div class="layout-push-stream">
    <a-layout>
      <a-layout-content>
        <div class="draggable"></div>

        <div class="leading">
          <div class="welcome">
            <div>欢迎使用<div class="typed-element"></div>直播助手</div>
          </div>
          <a-row :gutter="30">
            <a-col
              :span="8"
              v-for="item in jianjie"
              :key="item"
              style="marginBottom: 16px"
            >
              <a-card>
                <div style="color: red">
                  <component
                    :is="item.icon"
                    size="30"
                    strokeLinecap="round"
                    :strokeWidth="4"
                    :style="{ color: 'rgb(78,89,105)' }"
                  />
                </div>
                <div class="title">{{ item.title }}</div>
                <p>{{ item.description }}</p>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script setup>
import { ref, reactive,onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import Typed from 'typed.js'

onMounted(()=>{
  var options = {
  strings: ["Wujing", "最好的"],
  typeSpeed: 80,
  backSpeed: 80,
  loop: true
};

var typed = new Typed(".typed-element", options);
})

const router = useRouter();
const jianjie = ref([
  {
    title: "无人直播",
    description: "无需值守，轻松直播",
    icon: "icon-live-broadcast",
  },
  {
    title: "循环播放",
    description: "支持视频列表循环播放",
    icon: "icon-sync",
  },
  {
    title: "画面截取",
    description: "自定义选择直播视频区域",
    icon: "icon-fullscreen",
  },
  {
    title: "多平台配置保存",
    description: "可保存多个平台直播参数",
    icon: "icon-save",
  },
  {
    title: "定时推送",
    description: "提前设置直播开始/结束时间",
    icon: "icon-send",
  },
  {
    title: "操作简单易用",
    description: "操作简单，一键推送",
    icon: "icon-robot",
  },
]);

const handlePressEnter = (e) => {
  console.log(e.target.defaultValue);
};
const selectStream = ref(0);
const handleSelectStream = (val) => {
  selectStream.value = val;
};
const existsStream = ref(true);
</script>

<style scoped lang="less">
.layout-push-stream :deep(.arco-layout-sider) {
  width: 50px;
  height: 100vh;
  box-shadow: none;
  border-right: 1px solid rgb(var(--gray-3));
  // background-color: rgba(var(--gray-1));
  overflow: hidden;
  overflow: visible;
}

.draggable {
  -webkit-app-region: drag;
  -webkit-user-select: none;
  user-select: none;
  height: 55px;
  display: felx;
  justify-content: flex-start;
}

.header {
  height: 80px;
  background-color: blue;
  display: none;
}

.push-list-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  padding-bottom: 0;

  .title1 {
    font-size: 14px;
    font-weight: bold;
    color: rgb(--var(--gray-10));
  }

  .add {
    color: rgb(var(--gray-5));
  }
}

.sider-footer-menu {
  position: absolute;
  bottom: 10px;
  text-align: center;
  width: 100%;

  .menu-item {
    display: flex;
    justify-content: start;
    align-items: center;
    padding-left: 15px;
  }

  .item {
    font-size: 12px;
    margin-left: 6px;
  }
}

.push-search {
  padding: 5px;
}

.push-list-container {
  // margin-top: 10px;
  overflow: auto;
  height: calc(100vh - 170px);

  .item {
    text-align: left;
    font-size: 14px;
    color: rgb(var(--gray-10));
    border-bottom: 1px solid rgb(var(--gray-2));
    padding: 7px;
    padding-left: 15px;
    display: flex;
    align-items: center;

    span {
      margin-left: 5px;
      display: inline-block;
    }
  }

  .empty {
    height: 60vh;
    display: flex;
    align-items: center;
  }

  :deep(.arco-btn) {
    justify-content: flex-start;
  }
}

.video-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgb(var(--gray-2));
}

.video-list .title {
  font-size: 12px;
  margin-right: auto;
}

.video-list .right {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.leading {
  height: 85vh;
  display: flex;
  align-items: center;
  justify-items: center;
  justify-content: center;
  margin: 16px auto;
  max-width: 90%;
  flex-direction: column;

  .title {
    font-size: 16px;
    margin-top: 20px;
    font-weight: bold;
  }

  p {
    font-size: 14px;
    margin-top: 10px;
  }

  .welcome {
    width: 100%;
    text-align: center;
    display: flex;
    justify-content: center;
    margin-bottom: 50px;
    font-size: 2em;
    font-weight: bold;
    color: rgb(var(--gray-10));

    span {
      color: rgb(var(--arcoblue-6));
      font-weight: bold;
    }
  }
}

.typed-element {
  display: inline-block;
  color: rgb(var(--primary-6));
  padding: 0 10px;
}
</style>
