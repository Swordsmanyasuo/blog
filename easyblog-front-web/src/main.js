import { createApp } from 'vue'
import '@/assets/scss/base.scss'
import App from './App.vue'
import router from "@/router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import Request from '@/utils/Request'

import Pagination from '@/views/components/Pagination.vue'
import Comment from '@/views/components/Comment.vue'
const app = createApp(App);
app.config.globalProperties.Request = Request;
app.config.globalProperties.globalInfo = {
    getImageUrl: "/api/file/getImage/",
};
app.component("Pagination", Pagination);
app.component("Comment", Comment);
app.use(router)
app.use(ElementPlus);
app.mount('#app')
