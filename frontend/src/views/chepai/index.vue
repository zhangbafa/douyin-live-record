<template>
<a-layout style="height: 100vh;">
    <a-layout-header>
        <div contenteditable class="title">车牌估值</div>
        <a-row class="grid-demo" justify="center">
          <a-col :xs="20" :sm="16" :md="12" :lg="12" :xl="12" :xxl="12">
            <a-form size="large" :model="form"  @submit="handleSubmit">
                <a-input
                  v-model="form.num"
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
                <div class="cp-content">
                <div class="content">
                    <div class="label">车牌估值: </div>
                    <div class="price">{{ result.price }}</div>
                </div>
                <div class="content">
                    <div class="label">回头指数: </div>
                    <a-rate :default-value="0" :model-value="result.star" readonly/>
                </div>
            </div>
            </a-card>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer>
        <div style="color: #fff;font-size: 10px;">数据来源: 车主之家</div>
      </a-layout-footer>
</a-layout>
</template>

<script setup>
import  { ref,reactive } from 'vue'
const result = reactive({
    nummber:'-',
    price:'-',
    area:'-',
    star: 0
})
const form = reactive({
    num: '',
});
const handleSubmit = ()=> {
    fetchAndExtract(form.num)
}
async function fetchAndExtract(cp) {
    try {
        // 获取网页内容
        const response = await fetch('https://app.16888.com/gz/?pz='+cp+'&act=gz&name=%E8%BD%A6%E4%B8%BB%E4%B9%8B%E5%AE%B6');
        const text = await response.text();

        // 创建一个 DOMParser 实例
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // 获取 class="c_con" 元素
        const cConElement = doc.querySelector('.c_con');
        if (cConElement) {
            // 提取内容
            const plateNumberMatch = cConElement.textContent.match(/车牌号码：\s*(\S+)/);
            const plateValueMatch = cConElement.textContent.match(/车牌估值：\s*([\d,]+人民币)/);
            // const plateLocationMatch = cConElement.textContent.match(/车牌归属：\s*(.*?)\s*<br>/);
            const plateLocationMatch = cConElement.textContent.match(/车牌归属：\s*(.*?)\s*\n/);
            const starsCount = (cConElement.innerHTML.match(/★/g) || []).length;

            // 输出结果
            // console.log(`车牌号码: ${plateNumberMatch ? plateNumberMatch[1] : '未找到'}`);
            // console.log(`车牌估值: ${plateValueMatch ? plateValueMatch[1] : '未找到'}`);
            // console.log(`车牌归属: ${plateLocationMatch ? plateLocationMatch[1] : '未找到'}`);
            // console.log(`回头指数中的★数量: ${starsCount}`);
            result.nummber = `${plateNumberMatch ? plateNumberMatch[1] : '-'}`
            result.price = `${plateValueMatch ? plateValueMatch[1] : '-'}`
            result.area = `${plateLocationMatch ? plateLocationMatch[1] : '-'}`
            result.star = starsCount
        } else {
            console.log('未找到 class="c_con" 元素');
        }
    } catch (error) {
        console.error('获取和提取网页内容时出错:', error);
    }
}
fetchAndExtract()
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
.cp-content {
    text-align: left;
}
.content{
 display: flex;
 justify-content: flex-start;
 align-items: center;
 margin-bottom: 20px;
 margin-top: 20px;
}

.content .label{ 
    margin-right: 20px;
    font-size: 18px;
    
}
.content .price{
    font-size: 24px;
    font-weight: bold;
    color: red
}
</style>