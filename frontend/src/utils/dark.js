// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useDark() {
    const dark = ref(false)
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    function handleThemeChange(event) {
      if (event.matches) {
        // 切换到深色模式
        dark.value = true
        document.body.setAttribute('arco-theme', 'dark');
      } else {
        // 切换到浅色模式
        dark.value = false
        document.body.removeAttribute('arco-theme');
      }
    }
    // 初次加载时检查主题
    handleThemeChange(darkModeQuery);
    // 监听主题变化事件
    darkModeQuery.addEventListener('change', handleThemeChange);
    return {dark}
}