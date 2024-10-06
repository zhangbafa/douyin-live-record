import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import App from './App.vue';
import './assets/global.less';
import './assets/loaders.min.css'
import '@arco-design/web-vue/dist/arco.css';
import components from './components/global';
import Router from './router/index';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';

const app = createApp(App)
app.config.productionTip = false

// components
for (const i in components) {
  app.component(i, components[i])
}

app.use(Router)
.use(ArcoVue)
.use(ArcoVueIcon)
.mount('#app')