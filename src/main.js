import { createApp } from 'vue'
import App from './App.vue'
import debounce from './directive/debounce'
import copy from './directive/copy'
import ElementPlus from 'element-plus';
import moment from 'moment';
import 'element-plus/lib/theme-chalk/index.css';
import './assets/css/reset.css'

// 导入路由
import router from './router'
import store from './store'

import { registerMicroApps, start } from 'qiankun';
registerMicroApps([
	{
		name: 'vue4-demo1', // 应用的名字
		entry: '//localhost:8081/', // 默认会加载这个html 解析里面的js 动态的执行 （子应用必须支持跨域）fetch
		container: '#vue', // 容器名
		activeRule: '/home' // 激活的路径 
	},
]);
start({
	// 取消预加载
	prefetch: true
});

const app = createApp(App)

// 全局过滤器
app.config.globalProperties.$filters = {
	rePlayCount (val) {
		if (val > 99999) {
			return Math.floor(val / 10000) + '万'
		} else {
			return val
		}
	},
	reDuration (dt) {
		let min = Math.floor(dt / 1000 / 60)
		min = min < 10 ? '0' + min : min
		// 秒
		let sec = Math.ceil(dt / 1000 - min * 60)
		sec = sec < 10 ? '0' + sec : sec
		return min + ':' + sec
	},
	reTime (t) {
		return moment(t).format('YYYY-MM-DD hh:mm:ss')
	},
	reTimeY (t) {
		return moment(t).format('YYYY-MM-DD')
	}
}

app.directive('my-debounce', debounce)
app.directive('my-copy', copy)
app.use(ElementPlus)
app.use(router)
app.use(store)
app.mount('#app')
