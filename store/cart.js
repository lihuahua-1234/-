export default {
  // 为当前模块开启命名空间
  namespaced: true,
  state: () => ({
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  
  // 模块的 mutations 方法
  mutations: {
    addToCart(state, goods) {
      // 根据提交的商品的Id，查询购物车中是否存在这件商品
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const findResult = state.cart.find(cart => cart.goods_id === goods.goods_id)
      if (findResult === undefined) {
        state.cart.push(goods)
      } else {
        findResult.goods_count++
      }
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit('m_cart/saveToStorage')
    },

    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },

    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
      const findResult = state.cart.find(cart => cart.goods_id === goods.goods_id)
      // 有对应的商品信息对象
      if (findResult !== undefined) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      // 如果不存在，则 findResult 为 undefined；否则，为查找到的商品信息对象
     const findResult = state.cart.find(cart => cart.goods_id === goods.goods_id)
     if (findResult !== undefined) {
       // 更新对应商品的数量
       findResult.goods_count = goods.goods_count
       // 持久化存储到本地
       this.commit('m_cart/saveToStorage')
     }
    },
    
    // 根据 Id 从购物车中删除对应的商品信息
    removeGoodsById(state, goods) {
      // 调用数组的 filter 方法进行过滤那些不需要被删除的商品重新组成新数组
      state.cart = state.cart.filter(cart => cart.goods_id !== goods.goods_id) 
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    
    // 全选影响单选
    updateAllGoodsState(state, newState) {
      // 循环更新购物车中每件商品的勾选状态
      state.cart.forEach(x => x.goods_state = newState)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    }
  },


  // 模块的 getters 属性
  getters: {
    // 统计购物车中商品的总数量
    total(state) {
      // let num = 0
      // // 循环统计商品的数量，累加到变量 num 中
      // state.cart.forEach(cart => num += cart.goods_count)
      // return num
     return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    
    // 勾选的商品的总数量
    checkedCount(state) {
     // 先使用 filter 方法，从购物车中过滤器已勾选的商品
     // 再使用 reduce 方法，将已勾选的商品总数量进行累加
     // reduce() 的返回值就是已勾选的商品的总数量
     return state.cart.filter(cart => cart.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    
    // 已勾选的商品的总价
    checkedGoodsAmount(state) {
     // 先使用 filter 方法，从购物车中过滤器已勾选的商品
     // 再使用 reduce 方法，将已勾选的商品数量 * 单价之后，进行累加
     // reduce() 的返回值就是已勾选的商品的总价
     // 最后调用 toFixed(2) 方法，保留两位小数
     return state.cart.filter(cart => cart.goods_state)
     .reduce((total, item) => total += item.goods_price * item.goods_count, 0)
     .toFixed(2)
    }
  }
}
