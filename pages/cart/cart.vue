<template>
  <view class="cart-container" v-if="cart.length > 0">
    <!--收货地址组件-->
    <my-address></my-address>
    <!--商品列表的标题区域-->
    <view class="cart-title">
      <!--左侧的图标-->
      <uni-icons type="shop" size="18"></uni-icons>
      <!--右侧文本-->
      <text class="cart-title-text">购物车</text>
    </view>

    <uni-swipe-action>
      <!--循环渲染购物车中的商品信息-->
      <block v-for="(goods, i) in cart" :key="i">
        <!-- uni-swipe-action-item 可以为其子节点提供滑动操作的效果。需要通过 options 属性来指定操作按钮的配置信息 -->
        <uni-swipe-action-item :options="options" @click="swipeActionClickHandler(goods)">
          <my-goods 
          :goods="goods" 
          :showRadio="true"
          :showNum="true" 
          @radio-change="Radiochange" 
          @num-change="numberChangeHandler"></my-goods>
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>
    <!--使用自定义的结算组件-->
    <my-settle></my-settle>
  </view>
  
  <!-- 空白购物车区域 -->
  <view class="empty-cart" v-else>
    <image src="/static/cart_empty@2x.png" class="empty-img"></image>
    <text class="tip-text">没有商品哟，快去购物吧</text>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  // 按需导入 mapState 这个辅助函数
  import { mapState, mapMutations } from 'vuex'
  export default {
    computed: {
      // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
      ...mapState('m_cart', ['cart']),
    },
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins: [badgeMix],
    data() {
      return {
        options: [{
          text: '删除', // 显示的文本内容
          style: {
            backgroundColor: '#C00000' // 按钮的背景颜色
          }
        }]
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
      // 商品的勾选状态发生了变化
      Radiochange(e) {
        // console.log(e)
        this.updateGoodsState(e)
      },
      // 商品的数量发生了变化
      numberChangeHandler(e) {
        // console.log(e)
        this.updateGoodsCount(e)
      },

      // 点击了滑动操作按钮
      swipeActionClickHandler(goods) {
        //console.log(goods)
        this.removeGoodsById(goods)
        uni.$showMsg('删除成功')
      }
    }
  }
</script>

<style lang="scss">
  .cart-container {
    padding-bottom: 50px;
  }
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #efefef;
    padding-left: 10px;

    .cart-title-text {
      font-size: 14px;
      margin-left: 5px;
    }
  }
  
  .empty-cart {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150px;
    .empty-img {
      width: 90px;
      height: 90px;
    }
    .tip-text {
      font-size: 12px;
      color: gray;
      margin-top: 15px;
    }
  }
</style>
