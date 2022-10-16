<template>
	<view class="search-box">
		<uni-search-bar @input="input" :radius="100" cancelButton="none" ></uni-search-bar>
    <!--搜索建议列表-->
    <view class="sugg-list" v-if="searchResults.length > 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
    <!--搜索历史-->
    <view class="history-box" v-else>
      <!--标题区域-->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean"></uni-icons>
      </view>
      <!--列表区域-->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in historyList" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 延时器
        timer: null,
        // 搜索关键词
        kw:'',
        // 搜索结果列表
        searchResults: [],
        // 搜索历史的数组
        historyList: [],
        list:[]
        
			};
		},
    onLoad() {
      // 读取本地存储
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        // 清除 timer 对应的延时器
        clearTimeout(this.timer)
        // 重新启动一个延时器，并把 timerId 赋值给 this.timer
       this.timer = setTimeout(() => {
         // 如果 2 秒内，没有触发新的输入事件，则为搜索关键词赋值
         this.kw = e.value
          //console.log(e.value)
          this.getSearchResults()
        }, 2000)
      },
      // 根据搜索关键词，搜索商品建议列表
     async getSearchResults() {
       if (this.kw === '') {
         this.searchResults = []
         return
       }
       // 发起请求，获取搜索建议列表
       const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query:this.kw})
       if (res.meta.status !== 200) return uni.$showMsg()
       this.searchResults = res.message
       // 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
       this.saveSearchHistory()
      },
      // 路径跳转
      gotoDetail(item) {
        uni.navigateTo({
          url:`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
        })
      },
      // 保存搜索关键词的方法
      saveSearchHistory() {
        // 方法一
        // 要求：不要有重复历史记录， 最新的排在最前面
        // indexOf() 方法可返回某个指定的字符串值在字符串中首次出现的位置
        // 没有找到匹配的字符串则返回 -1
        const index = this.historyList.indexOf(this.kw)
        if (index !== -1) {
          this.historyList.splice(index, 1)
        }
        this.historyList.unshift(this.kw)
        // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw',JSON.stringify(this.historyList)) 
      },
      
      // 删除历史记录
      clean() {
        this.historyList = []
        uni.setStorageSync('kw', '[]')
      },
      // 点击历史记录跳转
      gotoGoodsList(item) {
        uni.navigateTo({
          url: `/subpkg/goods_list/goods_list?query=${item}`
        })
      }
    }
	}
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 10px;
  .sugg-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0;
    font-size: 12px;
    border-bottom: 1px solid #efefef;
    
    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.history-box {
  padding: 0 10px;
  .history-title {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    border-bottom: 1px solid #efefef;
  }
  .history-list { 
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
      border-radius: 20 px;
    }
  }
}
</style>
