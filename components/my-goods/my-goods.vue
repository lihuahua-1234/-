<template>
  <view class="goods-item">
    <!--商品左侧图片区域-->
    <view class="goods-item-left">
      <radio v-if="showRadio" :checked="goods.goods_state" color="#C00000" style="transform:scale(0.8)" @click="radioClickHandler"></radio>
      <image v-if="goods.goods_small_logo" :src="goods.goods_small_logo" class="goods-pic"></image>
      <image v-else :src="defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 商品价格 -->
        <view class="goods-price">￥{{goods.goods_price | tofixed}}</view>
        <!-- 商品数量 -->
        <uni-number-box v-if="showNum" :min="1" :value="goods.goods_count" @change="numChangeHandler"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
    import { mapGetters } from 'vuex'
  export default {
    computed: {
      ...mapGetters('m_cart', ['total']),
    },
    // 定义 props 属性，用来接收外界传递到当前组件的数据
    props: {
      // 商品的信息对象
      goods: {
        type: Object,
        defaul: {},
      },
      // 是否展示图片左侧的 radio
      showRadio: {
        type: Boolean,
        defaul: false
      },
      // 是否展示价格右侧的 NumberBox 组件
      showNum: {
        type: Boolean,
        defaul: false
      }
    },
    data() {
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      }
    },
    // 过滤器节点
    filters: {
      // 把数字处理为带两位小数点的数字
      tofixed(num) {
        return Number(num).toFixed(2)
      }
    },
    methods: {
      radioClickHandler() {
        // 通过 this.$emit() 触发外界通过 @ 绑定的 radio-change 事件，
        // 同时把商品的 Id 和 勾选状态 作为参数传递给 radio-change 事件处理函数
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      // NumberBox 组件的 change 事件处理函数
      numChangeHandler(val) {
        // 通过 this.$emit() 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          // 商品的最新数量
          goods_count: +val
        })
        // 调用 uni.setTabBarBadge() 方法，为购物徽标动态刷新
        uni.setTabBarBadge({
          index: 2, // 索引
          text: this.total + '' // 注意：text 的值必须是字符串，不能是数字
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item {
    // 让 goods-item 项占满整个屏幕的宽度
    width: 750rpx;
    // 设置盒模型为 border-box
    box-sizing: border-box;
    display: flex;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 5px;

    .goods-item-left {
      margin-right: 5px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .goods-pic {
        width: 100px;
        height: 100px;
        display: block; // 防止图片有空白缝隙
        border-radius: 5px;
      }
    }

    .goods-item-right {
      display: flex;
      flex: 1;
      flex-direction: column;
      justify-content: space-between;

      .goods-name {
        font-size: 13px;
      }

      .goods-info-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .goods-price {
        font-size: 16px;
        color: #C00000;
      }
    }
  }
</style>
