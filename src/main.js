import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "./assets/icon/iconfont.css"

import Request from './utils/Require'
import Message from './utils/Message'

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.Request = Request
app.config.globalProperties.Message = Message
app.config.globalProperties.globalInfo = {
    imagUrl:"/api/file/getImage/"
}
app.mount('#app');

