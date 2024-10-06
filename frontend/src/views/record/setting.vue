<template>
  <div class="setting-container">
    <a-tabs :position="position">
        <a-tab-pane key="1" title="基本设置">
          <a-form
            ref="formRef"
            size="large"
            :model="form"
            @submit="handleSubmit"
            style="width: 98%"
          >
            <a-form-item field="savedir" label="保存位置">
              <a-input v-model="form.savedir" placeholder="" allow-clear />
              <a-button
                @click="handleSelectFolder"
                :style="{ marginLeft: '10px' }"
                >选择目录</a-button
              >
            </a-form-item>
            <a-form-item field="segment" label="自动分段">
              <a-switch v-model="form.segment" />
            </a-form-item>
            <a-form-item field="segmentDuration" label="分段时长">
              <a-input v-model="form.segmentDuration" placeholder="">
                <template #append>分钟</template>
              </a-input>
            </a-form-item>
            <a-form-item field="cookie" label="Cookie">
              <a-textarea
                placeholder=""
                :rules="[{ required: true, message: '不能为空' }]"
                :validate-trigger="['change', 'input']"
                v-model="form.cookie"
              >
              </a-textarea>
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button html-type="submit" type="primary" long>确定</a-button>
                <!-- <a-button long @click="$refs.formRef.resetFields()"
                >重置</a-button> -->
              </a-space>
            </a-form-item>
          </a-form>
        </a-tab-pane>
        <a-tab-pane key="2" title="音视频转写">
          <div class="models-container">
            <div class="title">支持多语言</div>
            <div class="item" v-for="item in multiModels" :key="item.value">
              <div>
                <div class="name">{{ item.label }}</div>
                <div class="description">
                  <template v-if="item.speed >= 5">
                    输出文字速度快，转写文字质量一般
                  </template>
                  <template v-if="item.speed == 4">
                    输出文字速度适中，转写文字质量较好
                  </template>
                  <template v-if="item.speed < 4">
                    输出文字速度慢，转写文字质量最佳
                  </template>
                  ({{ item.size }})
                </div>
              </div>
              <div>
                <a-button>下载</a-button>
              </div>
            </div>
          </div>
          <div class="models-container">
            <div class="title">支持多英语</div>
            <div class="item" v-for="item in enModels" :key="item.value">
              <div>
                <div class="name">{{ item.label }}</div>
                <div class="description">
                  <template v-if="item.speed >= 5">
                    输出文字速度快，转写文字质量一般
                  </template>
                  <template v-if="item.speed == 4">
                    输出文字速度适中，转写文字质量较好
                  </template>
                  <template v-if="item.speed < 4">
                    输出文字速度慢，转写文字质量最佳
                  </template>
                  ({{ item.size }})
                </div>
              </div>
              <div>
                <a-button>下载</a-button>
              </div>
            </div>
          </div>
          <div class="models-container">
            <div class="title">支持中文</div>
            <div class="item" v-for="item in zhModels" :key="item.value">
              <div>
                <div class="name">{{ item.label }}</div>
                <div class="description">
                  <template v-if="item.speed >= 5">
                    输出文字速度快，转写文字质量一般
                  </template>
                  <template v-if="item.speed == 4">
                    输出文字速度适中，转写文字质量较好
                  </template>
                  <template v-if="item.speed < 4">
                    输出文字速度慢，转写文字质量最佳
                  </template>
                  ({{ item.size }})
                </div>
              </div>
              <div>
                <a-button>下载</a-button>
              </div>
            </div>
          </div>
          <div class="models-container">
            <div class="title">支持日语</div>
            <div class="item" v-for="item in jaModels" :key="item.value">
              <div>
                <div class="name">{{ item.label }}</div>
                <div class="description">
                  <template v-if="item.speed >= 5">
                    输出文字速度快，转写文字质量一般
                  </template>
                  <template v-if="item.speed == 4">
                    输出文字速度适中，转写文字质量较好
                  </template>
                  <template v-if="item.speed < 4">
                    输出文字速度慢，转写文字质量最佳
                  </template>
                  ({{ item.size }})
                </div>
              </div>
              <div>
                <a-button>下载</a-button>
              </div>
            </div>
          </div>
          </a-tab-pane>
      </a-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, toRaw } from "vue";
import { useRouter } from "vue-router";
import { ipc } from "@/utils/ipcRenderer";
import { settingApi } from "@/api/main";
import models from "@/utils/whisper-models.js";

const router = useRouter();
const position = ref("top");
const form = reactive({
  savedir: "",
  segment: false,
  segmentDuration: 10,
  cookie: "",
});

const multiModels = models.filter((model) => model.lang === "multi");
const enModels = models.filter((model) => model.lang === "en");
const zhModels = models.filter((model) => model.lang === "zh");
const jaModels = models.filter((model) => model.lang === "ja");

ipc.invoke(settingApi.getRecordSavePath).then((data) => {
  console.log(data);
  Object.assign(form, data);
});
const handleSelectFolder = () => {
  ipc.invoke(settingApi.selectFolder).then((res) => {
    console.log(res);
    if (res && res.length > 0) {
      form.savedir = res[0];
    } else {
      form.savedir = "";
    }
  });
};

const handleSubmit = () => {
  ipc.invoke(settingApi.store, toRaw(form)).then((res) => {
    alert("保存成功");
  });
};
const handleBack = () => {
  router.back();
};
const handleCancel = () => {
  router.push({ path: "/record" });
};
</script>

<style lang="less" scoped>
.setting-container {
  margin: 10px 0;
  .title {
    font-weight: bold;
    font-size: 20px;
    margin: 25px 0;
    padding-left: 10px;
    text-align: left;
  }
}

.models-container {
  margin: 10px 15px;
  .title{
    text-align: left;
    font-size:20px;
    font-weight: 800;
    color: rgb(var(--primary-6));
    margin-bottom: 20px;
    padding:0
  }
  .item {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    .name {
      font-size: 16px;
      font-weight: bold;
      text-align: left;
    }
    .description {
      font-size: 14px;
      color: rgb(var(--color-bg-2));
    }
  }
}
</style>
