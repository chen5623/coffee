<template>
  <div class="details">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      @click-left="goto"
      fixed
    />

    <!-- 商品数据 -->
    <div class="content">
      <div class="pro-img">
        <img class="auto-img" :src="productDetail.large_img" alt="" />
      </div>

      <div class="product">
        <div>
          <div class="pro-name">{{ productDetail.name }}</div>

          <div class="pro-list clear">
            <div class="pro-price fr">￥{{ productDetail.price }}</div>
          </div>

          <div class="classify">
            <div class="pro-item">
              商品选项：
              <div class="pro-count fr">
                <van-stepper
                  v-model="product.count"
                  theme="round"
                  button-size="22"
                  disable-input
                />
              </div>
            </div>
            <!-- 选项内容 -->
            <div
              class="cla-item clear"
              v-for="(item, index) in productDetail.rules"
              :key="index"
            >
              <div class="temp fl">{{ item.title }}</div>
              <div
                class="temp-list fl"
                :class="{ active: item.ruleIndex == i }"
                v-for="(v, i) in item.rule"
                :key="i"
                @click="togglePro(item, i)"
              >
                {{ v.title }}
              </div>
            </div>
          </div>

          <!-- 商品介绍 -->
          <div class="pro-detail">
            <div class="deta-box">商品介绍</div>
            <div class="deta-content">
              <div>
                <div
                  class="decon"
                  v-for="(item, index) in productDetail.desc"
                  :key="index"
                >
                  {{ index + 1 }}、{{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <van-goods-action>
        <van-goods-action-icon
          icon="cart-o"
          text="购物车"
          :badge="iscount == 0 ? '' : iscount"
          :color="iscount > 0 ? '#bd7833' : '#646566'"
          @click="goShopcar"
        />
        <van-goods-action-icon
          icon="star"
          :text="iscollect ? '已收藏' : '未收藏'"
          :color="iscollect ? '  #bd7833' : '#a0a0a0'"
          @click="collectProduct"
        />
        <van-goods-action-button
          type="warning"
          text="加入购物车"
          color="#faac5d"
          @click="buy(true)"
        />
        <van-goods-action-button
          type="danger"
          text="立即购买"
          color=" #bd7833"
          @click="addShopcar()"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/less/details.less";
export default {
  name: "Details",
  data() {
    return {
      // 商品的pid
      pid: "",

      // 商品数量
      product: {
        count: 1,
      },

      // 购物车商品数量
      iscount: 0,

      // 商品详情数据
      productDetail: {},

      // 是否已收藏商品
      iscollect: false,

      ispid: "",
    };
  },

  created() {
    // 拦截商品的pid
    this.pid = this.$route.params.pid;

    // 调用获取商品详情数据的方法
    this.getDetails();

    // 收藏商品
    this.findProduct();

    // 查询购物车数量
    this.seeShopcarcount();

    //
    this.ispid = this.$route.params;
  },

  methods: {
    // 获取商品详情数据
    getDetails() {
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,

        duration: 0,
      });

      this.axios({
        method: "GET",

        url: "/productDetail",

        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((result) => {
          this.$toast.clear();

          // 获取商品成功
          if (result.data.code == 600) {
            let data = result.data.result[0];

            data.desc = data.desc.split(/\n/);

            let rules = [];

            let ruleData = ["tem", "sugar", "milk", "cream"];

            ruleData.map((v) => {
              let r = {};

              r.title = data[v + "_desc"];

              //激活下标
              r.ruleIndex = 0;

              //每项规格
              r.rule = [];

              // 获取规格字符串
              let ruleString = data[v].split("/");

              ruleString.map((value) => {
                if (value != "") {
                  r.rule.push({ title: value });
                }
              });

              if (r.rule.length > 0) {
                rules.push(r);
              }
            });

            data.rules = rules;

            this.productDetail = data;

            //
          }
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 返回上一级
    goto() {
      this.$router.go(-1);
    },
    // 切换商品选项
    togglePro(item, i) {
      if (item.ruleIndex == i) {
        return;
      }
      item.ruleIndex = i;
    },

    // 查询商品是否已被收藏
    findProduct() {
      // 获取token
      let tokenString = localStorage.getItem("__log");
      //
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "GET",

        url: "/findlike",

        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          //
          this.$toast.clear();
          if (result.data.code == 1000) {
            if (result.data.result.length > 0) {
              this.iscollect = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 收藏商品
    collectProduct() {
      // 获取token
      let tokenString = localStorage.getItem("__log");
      //
      if (!tokenString) {
        this.$toast("未登录或登录失效，请登录");
        // 跳回登录页面
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 判断是收藏商品还是取消收藏商品
      let url = this.iscollect ? "/notlike" : "/like";

      // 发起请求
      this.axios({
        method: "POST",

        url,

        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          if (result.data.code == 700) {
            // 登录无效
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 800) {
            // 收藏商品成功
            this.iscollect = true;
          } else if (result.data.code == 900) {
            // 取消收藏商品
            this.iscollect = false;
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 查询购物车数量
    seeShopcarcount() {
      // 获取token
      let tokenString = localStorage.getItem("__log");
      //
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "GET",

        url: "/findAllShopcart",

        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          //
          this.$toast.clear();

          if (result.data.code == 5000) {
            this.iscount = result.data.result.length;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 商品加入购物车
    addShopcar(isBuy) {
      // 获取token
      let tokenString = localStorage.getItem("__log");
      //
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
      }

      // 请求参数
      let data = {
        tokenString,
        appkey: this.appkey,
        count: this.product.count,
        pid: this.pid,
      };

      let rs = [];
      // 获取选择商品的规格
      this.productDetail.rules.map((v) => {
        rs.push(v.rule[v.ruleIndex].title);
      });

      data.rule = rs.join("/");

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "POST",

        url: "/addShopcart",

        data,
      })
        .then((result) => {
          //
          this.$toast.clear();

          if (result.data.code == 700) {
            // token检验无效，跳转登录页面
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 3000) {
            if (isBuy) {
              if (result.data.status == 1) {
                this.iscount++;
              }
            } else {
              this.$router.push({
                name: "Indent",
                query: { sids: result.data.sid },
              });
            }
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 跳转购物车
    goShopcar() {
      this.$router.push({ name: "Shopcar", params: this.ispid });
    },

    // 立刻购买
    buy(isBuy) {
      this.addShopcar(isBuy);
    },
  },
};
</script>

<style lang="less" scoped>
</style>