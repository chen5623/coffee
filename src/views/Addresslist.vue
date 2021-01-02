<template>
  <div class="addresslist">
    <van-nav-bar
      title="地址列表"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <van-address-list
      default-tag-text="默认"
      :list="list"
      v-model="chosenAddressId"
      :switchable="false"
      @add="add"
      @edit="edit"
    />
    
  </div>
</template>

<script>
export default {
  name: "Addresslist",
  data() {
    return {
      chosenAddressId: "1",
      list: [],
    };
  },

  created() {
    // 获取地址数据
    this.getresslist();
  },
  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    // 获取地址数据
    getresslist() {
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

        url: "/findAddress",
        // 参数
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          //
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 20000) {
            result.data.result.map((v) => {
              v.isDefault = Boolean(v.isDefault);
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              this.list = result.data.result;
            });
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 新增地址
    add() {
      this.$router.push({ name: "AddressEdit" });
    },

    // 编辑地址
    edit(item) {
      this.$router.push({ name: "AddressEdit", query: { aid: item.aid } });
    },
  },
};
</script>

<style lang="less" scoped>
.addresslist {
  padding-top: 46px;

  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar .van-icon {
    color: #bd7833;
  }

  /deep/ .van-nav-bar__title {
    font-weight: 600;
  }
  /deep/ .van-tag--danger {
    background-color: #bd7833;
  }
  /deep/ .van-button--danger {
    background-color: #bd7833;
    border-color: #bd7833;
  }

  /deep/ .van-address-list__bottom {
    bottom: 10px;
    background-color: #f6f6f6;
  }
  /deep/ .van-address-item__value {
    padding-left: 10px;
  }
}
</style>