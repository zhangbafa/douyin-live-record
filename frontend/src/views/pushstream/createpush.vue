<template>
  <div>
    <div class="draggable"></div>
    <a-form
      ref="formRef"
      size="large"
      layout="vertical"
      :model="form"
      :style="{ width: '600px', margin: '50px auto' }"
      @submit="handleSubmit"
    >
      <a-form-item
        field="name"
        label="推送名称"
        :rules="[
          { required: true, message: '请填写推送名称' },
          { maxLength: 32, message: '不能超过 32 个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input
          v-model="form.name"
          allow-clear
          placeholder="请输入推送的名称（不能超过32个字符）"
        />
      </a-form-item>
      <!-- <a-form-item
      field="推送配置"
      label="推送配置"
      :rules="[{ match: /section one/, message: 'must select one' }]"
    >
      <a-select
        v-model="form.setting"
        placeholder="请选择"
        allow-clear
        style="margin-right: auto"
      >
        <a-option value="douyin">抖音</a-option>
        <a-option value="kuaishou">快手</a-option>
        <a-option value="pdd">拼多多</a-option>
      </a-select>
      <a-space style="margin-left: 8px">
        <a-button>重置</a-button>
        <a-button>全部更新</a-button>
      </a-space>
    </a-form-item> -->
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item field="fps" label="视频帧率（FPS）">
            <a-input-number v-model="form.fps" placeholder="默认25" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="vbps" label="视频码率">
            <a-input-number v-model="form.videobps" placeholder="默认3000" />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item field="outputw" label="视频宽度">
            <a-select
              v-model="form.outputw"
              placeholder="请选择分辨率"
              allow-clear
            >
              <a-option value="144">144</a-option>
              <a-option value="176">176</a-option>
              <a-option value="288">288</a-option>
              <a-option value="352">352</a-option>
              <a-option value="576">576</a-option>
              <a-option value="720">720</a-option>
              <a-option value="960">960</a-option>
              <a-option value="1080">1080</a-option>
              <a-option value="1280">1280</a-option>
              <a-option value="1920">1920</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="outputh" label="视频高度">
            <a-select
              v-model="form.outputh"
              placeholder="请选择分辨率"
              allow-clear
            >
              <a-option value="144">144</a-option>
              <a-option value="176">176</a-option>
              <a-option value="288">288</a-option>
              <a-option value="352">352</a-option>
              <a-option value="576">576</a-option>
              <a-option value="720">720</a-option>
              <a-option value="960">960</a-option>
              <a-option value="1080">1080</a-option>
              <a-option value="1280">1280</a-option>
              <a-option value="1920">1920</a-option>
            </a-select>
            <!-- <template #extra>
        <div>提示：自定义分辨率时候，宽高都只能是偶数，否则推送不成功</div>
      </template> -->
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="20">
        <a-col :span="12"
          ><a-form-item field="sampling_rate" label="音频采样率">
            <a-select
              v-model="form.samplingRate"
              placeholder="Please select ..."
              allow-clear
            >
              <a-option value="8000Hz">8000Hz</a-option>
              <a-option value="11025Hz">11025Hz</a-option>
              <a-option value="16000Hz">16000Hz</a-option>
              <a-option value="22050Hz">22050Hz</a-option>
            </a-select>
          </a-form-item></a-col
        >
        <a-col :span="12"
          ><a-form-item field="audiobps" label="音频码率">
            <a-select
              v-model="form.audiobps"
              placeholder="Please select ..."
              allow-clear
            >
              <a-option value="128kbps">128kbps</a-option>
              <a-option value="192kbps">192kbps</a-option>
              <a-option value="256kbps">256kbps</a-option>
              <a-option value="320kbps">320kbps</a-option>
            </a-select>
          </a-form-item></a-col
        >
      </a-row>

      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item field="keyframe" label="关键帧间距">
            <a-input-number v-model="form.keyframe" placeholder="默认值 25" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="pushDatetimeRange" label="定时推送">
            <a-time-picker
              type="time-range"
              v-model="form.pushDatetimeRange"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item
        field="address"
        label="推流地址"
        :rules="[{ required: true, message: '请填写推流地址' }]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model="form.address" placeholder="" />
      </a-form-item>
      <a-form-item field="secretKey" label="推送密钥">
        <a-input v-model="form.secretKey" placeholder="" />
      </a-form-item>
      <!-- <a-button>更多推流</a-button> -->

      <a-form-item>
        <a-space>
          <a-button html-type="submit" type="primary">确定</a-button>
          <a-button @click="$refs.formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
      <!-- <div>提示：若串流地址末尾以及地址密钥开头没有“/”，则在串流地址末尾或者地址密钥开头添加"/"</div> -->
    </a-form>
    {{ form }}
  </div>
</template>

<script setup>
import { reactive, toRaw, defineModel,ref } from "vue";
import { liveStreamApi } from "@/api/main";
import { Notification } from "@arco-design/web-vue";
import { ipc } from "@/utils/ipcRenderer";
import { useRouter,useRoute } from "vue-router";

const router = useRouter();
const route  = useRoute();
const refresh = defineModel();
const id = ref(route.query.id);
if(id.value && id.value>0){
  ipc.invoke(liveStreamApi.findone, {id:id.value}).then(res=>{
    Object.assign(form,res)
  })
}


const handleSubmit = ({ values, errors }) => {
  if (errors) {
    return false;
  }
  delete values.videos
  delete values.workspace
  ipc.invoke(liveStreamApi.create, toRaw(values)).then((response) => {
    console.log(response);
    if (response.success) {
      refresh.value = response.id
      Notification.info({
        title: "系统提示",
        content: "保存成功!",
      });
    }
  });
};
const print = () => {};
const form = reactive({
  name: "",
  setting: "douyin",
  fps: 25,
  videobps: 3000,
  keyframe: 25,
  outputw: 352,
  outputh: 960,
  samplingRate: "8000Hz",
  audiobps: "128kbps",
  pushDatetimeRange: [],
  address: "",
  secretKey: "",
  workspaceId: 1,
});
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
</style>
