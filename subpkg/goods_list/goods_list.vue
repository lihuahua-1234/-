<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量, 用来实现分页
        total: 0,
        // 节流阀
        isloading: false
      }
    },
    onLoad(options) {
      // 将页面参数转存到 this.queryObj 对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // console.log(options)

      this.getGoodsList()
    },
    methods: {
      async getGoodsList(cd) {
        // 开启节流阀
        this.isloading = true
        // 发请求
        const { data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 关闭节流阀
        this.isloading = false
        // 如果是下拉刷新 cd 值就调用
        cd && cd()
        // console.log(res)
        // 判断请求状态码
        if (res.meta.status !== 200) return uni.$showMsg()
        // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      // 点击跳转详情页
      gotoDetail(goods) {
        uni.navigateTo({
          url: `/subpkg/goods_detail/goods_detail?goods_id=${goods.goods_id}`
        })
      }
    },
    // 上拉触底
    onReachBottom() {
      // 判断是否还有下一页数据 页码值 * 每页显示多少条数据 >= 总数据条数
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
      // 判断节流阀的状态 为false，则发起额外的请求, true则不发起
      if (this.isloading === false) {
        // 让页码值自增 +1
        this.queryObj.pagenum++
        // 重新获取列表数据
        this.getGoodsList()
      }
    },
    // 下拉刷新
    onPullDownRefresh() {
      // console.log('刷新')
      // 重置数据
      this.goodsList = []
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      // 重新发请求
      this.getGoodsList(() =>
       // 关闭下拉刷新的效果
      uni.stopPullDownRefresh())
      
    }
  }
</script>

<style lang="scss">
</style>
