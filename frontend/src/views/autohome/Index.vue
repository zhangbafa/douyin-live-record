<template>
  <a-layout style="height: 100vh">
    <a-layout-header>
      <div contenteditable class="title">车系月销量</div>
      <a-row class="grid-demo" justify="center">
        <a-col :xs="20" :sm="16" :md="12" :lg="12" :xl="12" :xxl="12">
            <a-auto-complete
              @search="handleSearch"
              @select="handleSelect"
              placeholder=""
              allow-clear  
              :data="data"
            >
            </a-auto-complete> 
        </a-col>
      </a-row>
      <div v-if="isNotExists" class="not-exists">没有这个车系的数据</div>

    </a-layout-header>
    <a-layout-content style="margin-top: 60px">
      <a-row class="grid-demo" justify="center">
        <a-col :xs="20" :sm="16" :md="12" :lg="12" :xl="12" :xxl="12">
          <a-card>
            <div class="cp-content">
              
              <div class="content">
                <div class="label">销量:</div>
                <div class="price">{{ car.righttextone }}</div>
              </div>
              <div class="content">
                <div class="label">排名:</div>
                <span>{{ car.rank }}</span>
                <!-- <icon-arrow-rise v-if="car.rankchange > 0" style="color: red" />
                <icon-arrow-fall
                  v-if="car.rankchange < 0"
                  style="color: green"
                />
                <icon-minus v-if="car.rankchange == 0" style="color: gray" /> -->
                <!-- {{ car.rankchange }} -->
              </div>
              <div class="content">
                <div class="label">好评度:</div>
                <a-rate  :model-value="car.score" allow-half readonly/>
              </div>
              <div class="content">
                <div class="label">价格:</div>
                {{ car.priceinfo }}
              </div>
              
              
            </div>
          </a-card>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer> </a-layout-footer>
  </a-layout>
</template>

<script setup>
import { ref, reactive } from "vue";
import carSeriesMonthRank from "@/utils/carSeriesMonthRank";
import brankMonthRank from "@/utils/brankMonthRank";
const car = reactive({
  name: "-",
  priceinfo: "-",
  rank: 0,
  rankchange: 0,
  righttextone: "-",
  image:
    "http://car3.autoimg.cn/cardfs/series/g31/M0B/58/A2/400x300_autohomecar__ChxoHmXVw2qAaWiuAAg1C-bg8-c383.png.webp",
  score: "4.47",
});
const isNotExists = ref(false)
const handleSubmit = () => {};
const data = ref([])
const handleSearch = (value) => {
      if (value) {
        const result = carSeriesMonthRank
        .filter(item => item.name.includes(value))
        .map(item => ({ label: item.name,value:item.name }));
        data.value = result
      
      } else {
        data.value = []
      }
      if(data.value.length<=0){
        isNotExists.value = true
      }else{
        isNotExists.value = false
      }
      console.log(data.value.length)
}

const handleSelect = (e)=> {
    const result = carSeriesMonthRank.filter(item=>item.name==e)
    console.log(result)
    console.log(result[0])
    // if(result.lenght>0){
      Object.assign(car,result[0])
    // }
}
const filterOption = (e,a)=> {
    console.log(e,a)
    
}
</script>

<style>
.title {
  margin-bottom: 40px;
  margin-top: 90px;
  font-size: 30px;
  font-weight: bold;
  font-family: "阿里妈妈方圆体 VF Regular";
  color: rgb(var(--gray-8));
}

.cp-content {
  text-align: left;
}

.content {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
  font-size: 20px;
  font-family: "阿里妈妈方圆体 VF Regular";

}

.content .label {
  margin-right: 20px;
  font-size: 18px;
}
.content span{
  font-family: "阿里妈妈方圆体 VF Regular";
  font-weight: bold;

}
.content .price {
  font-size: 24px;
  font-weight: bold;
  color: red;
}

.arco-input-wrapper .arco-input.arco-input-size-medium {
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 16px;
    line-height: 1.8;
}
.not-exists {
  font-size: 14px;
  margin-top: 15px;
}
</style>
