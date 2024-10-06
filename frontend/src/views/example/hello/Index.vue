<template>
  <a-watermark :content="setting.watermarkText">
  <a-layout style="height: 100vh;">
      <a-layout-header>
        <div contenteditable class="title">{{ setting.appname }}</div>
        <a-row class="grid-demo" justify="center">
          <a-col :xs="20" :sm="16" :md="12" :lg="12" :xl="12" :xxl="12">
            <a-form size="large" :model="form"  @submit="handleSubmit">
                <a-input
                  v-model="form.phone"
                  placeholder=""
                  ref="autoFocus" 
                  size="large"
                  :allowClear="true"
                  :style="{ height: '50px',fontSize:'18px' }"
                />
            </a-form>
          </a-col>
        </a-row>
        
      </a-layout-header>
      <a-layout-content style="margin-top: 60px;">
        <a-row class="grid-demo" justify="center">
          <a-col :xs="20" :sm="16" :md="12" :lg="12" :xl="12" :xxl="12">
            <a-card>
              <div v-if="result && result.description">
                <!-- <div class="jixiong">
                  <span class="ji" v-if="result.evaluation=='吉'">{{ result.evaluation }}</span>
                  <span class="xiong" v-else>{{ result.evaluation }}</span>
                </div> -->
                <p class="shiyun" :class="{ji:result.evaluation=='吉'}">
                  {{ result.description }}
                </p>
                <p class="price">
                  号码价值预估：
                  <span>
                    ￥{{ price }}
                  </span>
                </p>
              </div>
              <a-empty v-else :description="setting.empytText"/>
            </a-card>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer style="display: flex;justify-content: flex-end;padding-bottom: 10px;padding-right: 10px;">
          <icon-settings @click="handleClick" />
      </a-layout-footer>
    </a-layout>
  </a-watermark>
  <!-- modal-setting -->
  <a-modal v-model:visible="visible" title="设置" @cancel="handleCancel" @before-ok="handleBeforeOk">
    <a-form :model="setting">
      <a-form-item field="title" label="名称">
        <a-input v-model="setting.appname" />
      </a-form-item>
      <a-form-item field="title" label="水印">
        <a-input v-model="setting.watermarkText" />
      </a-form-item>
      <a-form-item field="empytText" label="等待文本">
        <a-input v-model="setting.empytText" />
      </a-form-item>
      <a-form-item field="basePrice" label="基础价格">
        <a-input v-model="setting.basePrice" />
      </a-form-item>
      <a-form-item field="music" label="播放音效">
        <a-switch v-model="setting.soundEffect"/>
      </a-form-item>
      <a-form-item field="fireworks" label="播放烟花">
        <a-switch v-model="setting.fireworks"/>
      </a-form-item>
      <!-- <div>东方水淀粉</div> -->
      <a-form-item field="greenScreen" label="开启绿幕">
        <a-switch v-model="setting.greenScreen"/>
      </a-form-item>
      <a-form-item field="theme" label="暗黑模式">
        <component @click="handleChangeTheme" :is="dark ? 'icon-moon-fill' : 'icon-sun'" size="22"  strokeLinecap="round" :strokeWidth="4" :style="{color:'rgb(78,89,105)'}"/>
      </a-form-item>
    </a-form>
  </a-modal>
  <audio id="soundEffect"></audio>
</template>

<script>
import { reactive,onMounted,ref,watch } from 'vue';
import {arr1,arr2,calculateNumber} from '@/utils/data'
import confetti from 'canvas-confetti'
import MobileNumberEvaluator from '@/utils/calc'
import { useRoute } from 'vue-router';
import {useDark} from '@/utils/dark'
import calculate1 from '@/utils/calculate1'
import calculate2 from '@/utils/calculate2'
import calculate3 from '@/utils/calculate3'
import calculate4 from '@/utils/calculate4'
export default {
  setup() {
    const form = reactive({
      phone: '',
    });
    const autoFocus = ref(null)
    const title = ref('测算结果')
    const price = ref(0)
    const initialState = {
      id: '',
      description: '',
      evaluation: ''
    };
    const result = reactive({...initialState})
  
    // 暗黑模式
    const {dark} = useDark()
    const handleChangeTheme = () =>{
      const theme = document.body.getAttribute('arco-theme')
      if(theme && theme == 'dark'){
        document.body.removeAttribute('arco-theme');
        dark.value = false
      }else{
        document.body.setAttribute('arco-theme', 'dark');
        dark.value = true
      }
    }

    // 开始测算
    const handleSubmit = (data) => {
      const num = calculateNumber(form.phone)
      if(num==0 || num>=82){num=1}
      Object.assign(result, arr1[num-1]);

      // 开始测算、估值
      if(result.evaluation=='吉'){
        const price1 = calculate1(form.phone) * setting.basePrice
        const price2 = calculate1(form.phone) * setting.basePrice
        const price3 = calculate1(form.phone) * setting.basePrice
        const price4 = calculate1(form.phone) * setting.basePrice
        price.value = parseInt(price1 + price2 + price3 + price4)
      }else{
        price.value = `0,此号可弃`
      }
      

      // 播放烟花效果
      if(result.evaluation=='吉' && setting.fireworks){
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      // 播放音效
      var audio = document.getElementById("soundEffect");
      if(setting.soundEffect && result.evaluation=='吉'){
        audio.src="https://downsc.chinaz.net/Files/DownLoad/sound1/202306/y1868.mp3"
        audio.currentTime = 1; // 设置播放时间为第10秒
        audio.play(); // 开始播放
        setTimeout(function() {
          audio.pause();
        }, 1500);
      };
    }
      

   
    const handleClear = () =>{
      Object.assign(result, initialState);
    }

    // 设置
    const visible = ref(false);
    const setting = reactive({
      appname: '手机后四位预测价值运势',
      empytText: '等待测算',
      watermarkText:'信则不灵，人能崇善',
      basePrice: 100,
      soundEffect: false,
      fireworks: false,
      greenScreen:false
    });

    const handleClick = () => {
      visible.value = true;
    };
    const handleBeforeOk = (done) => {
      if(setting.empytText.length<=0){
        setting.empytText = '  '
      }
      Object.assign(setting);
      window.setTimeout(() => {
        done()
      }, 500)
    };
    const handleCancel = () => {
      visible.value = false;
    }
    // 设置
    watch(()=>setting.greenScreen, (newColor) => {
      if(newColor){
        document.body.style.backgroundColor = 'rgb(0, 255, 0)';
      }else{
        document.body.style.backgroundColor = '';
      }
      
    });
    // greenScreen
    return {
      form,
      handleSubmit,
      result,
      price,

      handleChangeTheme,
      dark,

      setting,
      visible,
      handleClick,
      handleBeforeOk,
      handleCancel

    };
  },
};
</script>

<style>
.title{
  margin-bottom: 40px;
  margin-top: 90px;
  font-size: 30px;
  font-weight: bold;
  font-family:'阿里妈妈方圆体 VF Regular';
  color: rgb(var(--gray-8))
}
.jixiong{
  font-size: 40px;
  font-weight: 900;
  text-align: center;
  margin: 20px;
  color: red;
  font-family: "阿里妈妈方圆体 VF Regular";
}
.ji {
  color: rgb(var(--green-6))
}
.shiyun {
  font-size: 25px;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  font-family: "阿里妈妈方圆体 VF Regular";
  /* color: rgb(var(--green-6)) */
}
.price {
  font-size:18px;
}
.price span{
  font-weight: bold;
  font-family: "阿里妈妈方圆体 VF Regular";
  color: rgb(var(--orange-6))
}
.arco-input-wrapper .arco-input.arco-input-size-large {
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 20px;
    line-height: 1.5715;
    font-weight: bold;
    font-family: "阿里妈妈方圆体 VF Regular";
}

@font-face {
  font-family: "阿里妈妈方圆体 VF Regular";src: url("//at.alicdn.com/wf/webfont/jgGjJ3ckKOwU/bXaYQ4QS4VA9.woff2") format("woff2"),
  url("//at.alicdn.com/wf/webfont/jgGjJ3ckKOwU/8GRyNpSVJ3IY.woff") format("woff");
  font-display: swap;
}
</style>