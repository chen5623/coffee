<template>
  <div class="indent">
    <van-nav-bar
      title="订单结算"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />

    <div class="indent-box">
      <div class="site-box">
        <div class="site-title">
          <span @click="showAddress"
            >选择地址 <van-icon class="icon" name="arrow"
          /></span>
        </div>
        <div class="site-list clear">
          <div class="site-name fl">{{ currentAddress.name }}</div>
          <div class="site-phone fl">{{ currentAddress.tel }}</div>
        </div>
        <div class="site-txt">
          <span>详细地址：{{ currentAddress.address }}</span>
        </div>
      </div>
    </div>

    <div class="pro-box">
      <div
        class="pro-list clear"
        v-for="(item, index) in products"
        :key="index"
      >
        <div class="list-left fl">
          <div class="pro-img">
            <img class="auto-img" :src="item.small_img" />
          </div>
        </div>
        <div class="list-right fl">
          <div class="pro-top clear">
            <div class="pro-title fl">{{ item.name }}</div>
            <div class="pro-rule fl">{{ item.rule }}</div>
          </div>
          <div class="pro-centent">
            <div class="pro-enname">{{ item.enname }}</div>
          </div>
          <div class="pro-bottom clear">
            <div class="pro-price fl">￥{{ item.price }}</div>
            <div class="pro-count fr">x&nbsp;{{ item.count }}</div>
          </div>
        </div>
      </div>
    </div>
    <van-popup v-model="isShow" position="bottom" closeable>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @add="goNewAddress"
        @select="selectAddress"
      />
    </van-popup>
    <van-button
      type="primary"
      block
      class="btn"
      color="#bd7833"
      @click="closePay"
      >提交订单</van-button
    >
  </div>
</template>

<script>
import "../assets/less/indent.less";
export default {
  name: "Indent",
  data() {
    return {
      chosenAddressId: "",
      list: [],

      // 地址池
      isShow: false,

      // 商品的sids
      sids: [],

      // 选择地址的id
      addressId: "",

      // 选择当前地址
      currentAddress: {},

      // 商品数据
      productData: {
        count: 0,
        total: 0,
      },

      // 要购买商品的数据
      products: [],
    };
  },
  created() {
    // 截取sids
    this.sids = this.$route.query.sids.split("-");

    // 查询地址列表
    this.getAddressData();

    // 获取商品数据
    this.getShopcarData();
  },
  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    // 新增地址
    goNewAddress() {
      this.$router.push({ name: "AddressEdit" });
    },

    // 地址显示
    showAddress() {
      this.isShow = true;
    },

    // 地址选择
    selectAddress(item, index) {
      this.isShow = false;

      this.currentAddress = item;
    },

    // 获取地址列表数据
    getAddressData() {
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
              v.id = v.aid;
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

              if (v.isDefault) {
                this.addressId = v.aid;
                this.currentAddress = v;
              }
            });

            this.list = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 根据sids获取要购买的商品数据
    getShopcarData() {
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

        url: "/commitShopcart",
        // 参数
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
        },
      })
        .then((result) => {
          //
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 50000) {
            if (result.data.result.length == 0) {
              this.$router.push({ name: "Home" });
            }

            result.data.result.map((v) => {
              this.productData.count += v.count;
              this.productData.total += v.count * v.price;
            });

            this.products = result.data.result;
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 结算数据
    close() {
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

        url: "/pay",
        // 参数
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.currentAddress.tel,
          address: this.currentAddress.address,
          receiver: this.currentAddress.name,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);

            setTimeout(() => {
              this.$router.push({ name: "Order" });
            }, 500);
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 结算提示
    closePay() {
      if (!this.currentAddress.name) {
        this.$toast("请选择地址");
        return;
      }
      this.$dialog
        .confirm({
          title: "订单确定",
          message: "是否立刻去结算?",
          confirmButtonColor: "#bd7833",
        })
        .then(() => {
          this.close();
        })
        .catch((err) => {});
    },
  },
};
</script>