<template>
    <a-layout style="height: 100vh">
      <a-layout-header>
        <!-- <div class="title">车系月销量</div> -->
      </a-layout-header>
      <a-layout-content style="margin-top: 60px">
        <a-row class="grid-demo" justify="center">
          <a-col :xs="20" :sm="16" :md="12" :lg="12" :xl="12" :xxl="12">
            
            <a-card>
                <router-link to="/example">手机尾号估值/测吉凶</router-link>
            </a-card>
           <br/>
            <a-card>
                <router-link to="/chepai">车牌估值</router-link>
            </a-card>
            <br/>
            <a-card>
                <router-link to="/autohome">车系月销榜</router-link>
            </a-card>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer> </a-layout-footer>
    </a-layout>
  </template>
  
  <script setup>
  import { ref, reactive } from "vue"
  
  </script>
  
<style>
a {
    font-size: 20px;
    color: #000;
    text-decoration: none;
}
</style>