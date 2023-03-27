import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import "./assets/icon/iconfont.css"

import Request from './utils/Require'
import Message from './utils/Message'
import  VueCookies  from 'vue-cookies'

import Table from './components/Table.vue'
import Cover from './components/Cover.vue'
import Dialog from './components/Dialog.vue'
import CoverUpload from './components/CoverUpload.vue'
// import EditorHtml from './components/EditorHtml.vue'
// import EditorMarkdown from './components/EditorMarkdown.vue'
// import Window from './components/Window.vue'

const app = createApp(App);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.Request = Request
app.config.globalProperties.Message = Message
app.config.globalProperties.Cover = Cover
app.config.globalProperties.VueCookies = VueCookies
app.config.globalProperties.globalInfo = {
    imageUrl:"/api/file/getImage/"
}
app.component("Table",Table)
app.component("Cover",Cover)
app.component("Dialog",Dialog)
app.component("CoverUpload",CoverUpload)
// app.component("EditorHtml",EditorHtml)
// app.component("EditorMarkdown",EditorMarkdown)
// app.component("Window",Window)
app.mount('#app');

