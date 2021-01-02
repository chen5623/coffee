<template>
  <div class="search">
    <van-nav-bar
      left-text="返回"
      title="搜索商品"
      left-arrow
      fixed
      @click-left="back"
    />
    <div class="menu-search">
      <van-search placeholder="输入商品名称" v-model="name" ref="search" @search="search" />
    </div>

    <div class="link-box">
      <div
        class="link-item"
        v-for="(item, index) in products"
        :key="index"
        @click="goPage(item.pid)"
      >
        <div class="link-img">
          <img class="auto-img" :src="item.smallImg" alt="" />
        </div>
        <div class="link-title">
          <span>{{ item.name }}</span>
        </div>

        <div class="link-price fl">
          <span>￥{{ item.price }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Search",

  data() {
    return {
      // 搜索关键字
      name: "",

      // 搜索商品
      products: [],
    };
  },

  created() {
    this.$nextTick(() => {
      // 获取搜索框
      let searchIpt = this.$refs.search.querySelector('[type="search"]');

      searchIpt.focus();
    });
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    search() {
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "GET",

        url: "/search",
        // 参数
        params: {
          appkey: this.appkey,
          name: this.name,
        },
      })
        .then((result) => {
          
          this.$toast.clear();
          if (result.data.code == "Q001") {
            this.products = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

      // 跳转详情页
    goPage(pid) {
      this.$router.push({name:'Details',params:{pid}})
    },
  },
};
</script>

<style lang="less" scoped>
.search {
  padding-top: 46px;

  /deep/ .van-nav-bar .van-icon,
  /deep/ .van-nav-bar__text,
  /deep/ .home-search .van-icon {
    color: #bd7833;
  }

  /deep/ .van-nav-bar__right {
    width: calc(~"100% - 110px");
  }

  /deep/ .home-search {
    width: 100%;
  }
  /deep/ .home-search .van-search {
    padding: 0;
    border-radius: 17px;
    overflow: hidden;
  }
 .link-box {
    padding: 10px;
    margin-top: -20px;
    display: flex;
    flex-flow: wrap;
  }
  .link-item {
    width: calc(~"28.3333% - 10px");
    background-color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    margin-right: 10px;
    overflow: hidden;
    padding: 10px;
    margin-bottom: 10px;
    &:nth-child(3n) {
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