<template>
	<view class="my-search-container" :style="{'background-color': bgcolor}">
		<!--使用 view 组件模拟 input 输入框的样式-->
    <view class="my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placehoder">搜索</text>
    </view>
	</view>
</template>

<script>
	export default {
    props: {
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      radius: {
        type: Number,
        default: 20 // px
      }
    },
		data() {
			return {
				
			};
		},
    methods: {
      searchBoxHandler() {
        this.$emit('click')
      }
    }
	}
</script>

<style lang="scss">
.my-search-container {
  // background-color: #c00000;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  .my-search-box {
    height: 36px;
    background-color: #ffffff;
    // border-radius: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .placehoder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>
