<template>
    <div class="draggable"></div>
    <div class="setting-container">
        {{ machineId }}
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { settingApi} from "@/api/main";
import { ipc } from "@/utils/ipcRenderer";

const machineId = ref('0')
ipc.invoke(settingApi.getMachineId).then((res) => {
    machineId.value = res
});
</script>
<style>
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
.setting-container{
    margin-top: 50px;
}
</style>