<template>
	<view>
    <!--轮播图的区域-->
    <swiper :indicator-dots="true" :autoplay="true" :interval="2000" :circular="true">
      <!--是否显示面板指示点 是否自动切换 自动切换时间间隔 是否采用衔接滑动-->
      <swiper-item v-for="(item, i) in swiperList" :key="i">
        <navigator 
        class="swiper-item" 
        :url="`/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!--分类导航区域-->
    <view class="nav-list">
      <view 
      class="nav-item" 
      v-for="(item, i) in navList" 
      :key="i" 
      @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
    <!--楼层区域-->
    <view class="floor-list">
      <!--楼层 item-->
      <view class="foor-item" v-for="(item, i) in floorList" :key="i">
        <!--楼层标题-->
        <image :src="item.floor_title.image_src" class="floor-title"></image>
        <!--楼层图片区域-->
        <view class="floor-img-box">
          <!--左侧大图片盒子-->
          <navigator class="left-img-box" :url="item.product_list[0].url">
            <image :src="item.product_list[0].image_src" :style="{width:item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
          </navigator>
          <!--右侧4个图片盒子-->
          <view class="right-img-box">
            <navigator 
            class="right-img-item" 
            v-for="(item2, i2) in item.product_list" 
            :key="i2" 
            v-if="i2 !== 0"
            :url="item2.url"
            > 
              <image 
              :src="item2.image_src" 
              :style="{width:item2.image_width + 'rpx'}" 
              mode="widthFix"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
	</view>
</template>

<script>
	export default {
	  data() {
	    return {
	      // 1. 轮播图的数据列表，默认为空数组
	      swiperList: [],
        // 2. 分类导航的数据列表
        navList: [],
        // 3. 楼层的数据列表
        floorList: [],
	    }
	  },
	  onLoad() {
	    // 1.1. 调用获取轮播图数据的方法
	    this.getSwiperList()
      // 2.1. 调用获取轮播图数据的方法
      this.getNavList()
      // 3.1. 调用获取楼层的数据的方法
      this.getFloorList()
	  },
	  methods: {
	    // 1.2. 获取轮播图数据的方法
	    async getSwiperList() {
	      // 1.3 发起请求
	      const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
         //console.log(res)
         // 1.4 判断请求状态码
         if (res.meta.status !== 200) return uni.$showMsg()
         // 1.5 数据存储到
         this.swiperList = res.message
	    },
      // 2.2 分类导航的数据方法
      async getNavList() {
        const {data:res} = await uni.$http.get('/api/public/v1/home/catitems')
        // console.log(data)
        if(res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // 3.2 获取楼层方法
      async getFloorList() {
      const {data: res} = await uni.$http.get('/api/public/v1/home/floordata')
      //console.log(res)
      if (res.meta.status !== 200) return uni.$showMsg()
      // 对数据进行处理 通过双层 forEach 循环， 处理 URL 地址
      res.message.forEach(floor => {
        floor.product_list.forEach(prod => {
          // 生成一个自定义属性 url地址
          prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
        })
      })
      this.floorList = res.message
      },
      // 4. 点击事件处理函数 编程式导航
      navClickHandler(item) {
        //console.log(item)
        if(item.name === '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      }
	  }
	}
</script>

<style lang="scss">
swiper {
  height: 330rpx;
  .swiper-item,
  image {
    width: 100%;
    height: 100%;
  }
}

.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 30rpx 0;
  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}

.floor-title {
  display: flex;
  height: 68rpx;
  width: 100%;
}

.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.floor-img-box {
  display: flex;
  padding: 0 10rpx;
}
</style>
