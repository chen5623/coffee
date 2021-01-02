<template>
  <div class="link">
    <van-nav-bar
      title="我的收藏"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <div class="order-bg"></div>
    <div class="link-box" v-if="productData.length > 0">
        <div class="link-item" v-for="(item,index) in productData" :key="index" @click="goPage(item.pid)">
          <div class="link-img">
            <img class="auto-img" :src="item.smallImg" alt="">
          </div>
          <div class="link-title">
            <span>{{item.name}}</span>
          </div>

          <div class="link-price fl" >
            <span>￥{{item.price}}</span>
          </div>

          <div class="link-icon fr" @click.stop="removePro(item.pid,index)">
            <van-icon name="delete" />
          </div>
        </div>

    </div>
    <div v-else>
      <van-empty description="没有收藏的商品数据" />
    </div>

  </div>
</template>

<script>
export default {
  name: "Link",

  data() {
    return {
      productData:[]
    }
  },

  created() {
    this.getProduct();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    // 获取所用的收藏商品
    getProduct() {
      
      // 获取token
      let tokenString = localStorage.getItem("__log");
      // 
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "GET",

        url: "/findAllLike",
        // 参数
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if ( result.data.code == 2000 ) {
            this.productData = result.data.result;
            
          }
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

    // 跳转详情页
    goPage(pid) {
      this.$router.push({name:'Details',params:{pid}})
    },

    // 取消收藏商品
    removePro(pid,index) {
      // 获取token
      let tokenString = localStorage.getItem("__log");
      // 
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "POST",

        url: "/notlike",
        // 参数
        data: {
          appkey: this.appkey,
          tokenString,
          pid
        },
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if ( result.data.code == 900 ) {
          this.$toast('删除成功')

            this.productData.splice(index,1);

          }else {
            this.$toast('删除失败')
          }

        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    }
  },
};
</script>

<style lang="less" scoped>
.link {
  padding-top: 50px;
    /deep/ .van-nav-bar .van-icon,
  /deep/ .van-nav-bar__text {
    color: #bd7833;
  }
  .order-bg {
    border-radius: 10px;
    overflow: hidden;
    height: 100px;
    background: url('../assets/images/coffee-bg.jpg') no-repeat center center;
    background-size: 100% 100%;
  }
  .link-box {
    padding: 10px;
    margin-top: -20px;
    display: flex;
    flex-flow: wrap;
  }
  .link-item {
    width: calc(~"28.3333% - 10px");
    background-color:white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-right: 10px;
    overflow: hidden;
    padding: 10px;
    margin-bottom: 10px;
    &:nth-child(3n){
      margin-right: 0;
    }
  }
  .link-title {
    font-size: 14px;
    margin-top: 6px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-bottom: 6px;
  }
  .link-price {
    color: #bd7833;
  }
  .link-icon {
    font-size: 16px;
  }
}
</style>