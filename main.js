import Vue from 'vue'
import App from './App'
import store from '@/store/store.js'

// 1.导入网络请求的包
import { $http } from '@escook/request-miniprogram'
// 2.挂载到顶级对象中
uni.$http = $http
// 请求的根路径 请求头
$http.baseUrl = 'https://api-hmugo-web.itheima.net'
// 3.请求拦截器
$http.beforeRequest = function (options) {
  // 4.开启加载loading
  uni.showLoading({
    title:'数据加载中'
  })
}

// 5.响应拦截器
$http.afterRequest = function () {
  // 6.关闭加载loading
  uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function(title="数据请求失败", duration=1500) {
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
  store
})
app.$mount()
