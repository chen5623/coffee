<template>
  <div class="order">
    <van-nav-bar
      title="订单详情"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <div class="order-bg"></div>
    <div class="order-box">
      <van-tabs v-model="activeIndex" @change="changeTab">
        <van-tab
          :title="item.title"
          v-for="(item, index) in tabData"
          :key="index"
        >
          <div v-if="orderData.length > 0">
            <div class="prder-box" v-for="(v , k) in orderData " :key="v.oid">

              <div class="order-list">
                <div class="pro-box">
                  <div class="clear info-boxs">
                    <div class="info-title fl">{{v.oid}}</div>
                    <div class="fr re-info" v-if="true">
                      <div v-if="!(v.status == 2)" @click="receivePro(v,k)">确认收货</div>
                      <div class="clear" v-else>
                        <div class="fl">已完成</div>
                        <div class="fl delete" @click="removePro(v.oid , k)">
                          <van-icon size="19" name="delete" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div class="cell-list">
                      <!-- 商品信息 -->
                      <div class="order-item" v-for="(value , txt) in v.data" :key="txt">
                        <div class="cell-item-box">
                          <div class="pro-info-box">
                            <div class="fl pro-img">
                              <img class="auto-img" :src="value.smallImg || value.small_img" />
                            </div>
                            <div class="fl pro-info">
                              <div class="pro-info-text">
                                <div class="clear names">
                                  <div class="fl pro-name">{{value.name}}</div>
                                  <div class="fl pro-rule">{{value.rule}}</div>
                                </div>
                                <div class="pro-enname">{{value.enname}}</div>
                              </div>
                              <div class="pro-count-box">
                                <div class="fl pro-price">￥ {{value.price}}</div>
                                <div class="fr step-box">x {{value.count}}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="bottom-into">
                      <div class="circle">
                        <div class="fl circle-box circle-left"></div>
                        <div class="fr circle-box circle-right"></div>
                      </div>
                      <div class="date">{{v.date | formatDate('yyyy-MM-dd hh:mm:ss')}}</div>
                      <div class="clear">
                        <div class="fl">共计 {{v.count}} 件</div>
                        <div class="fr total">合计 ￥ {{v.total}}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <van-empty description="没有订单数据" />
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import "../assets/less/order.less";

export default {
  name: "Order",

  data() {
    return {
      activeIndex: 0,

      // 确定收货
      isRecrive: false,

      tabData: [{ title: "全部" }, { title: "进行中" }, { title: "已完成" }],

      orderData:[]
    };
  },
  created() {
    this.getOrderDatas();
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    // tab栏切换
    changeTab(name , title) {
      // 
      // 

      this.getOrderDatas();
    },

    // 根据订单状态获取订单数据
    getOrderDatas() {
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

        url: "/findOrder",
        // 参数
        params: {
          appkey:this.appkey,
          tokenString,
          status:this.activeIndex
        }
      })
        .then((result) => {
          // 
          this.$toast.clear();

          if (result.data.code == 700 ) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if(result.data.code == 70000) {
            // 按照订单编号进行分类
            let orderDatas = [];

            result.data.result.map(v => {

              for(let i = 0 ; i < orderDatas.length ; i ++) {
                if(orderDatas[i].oid == v.oid) {
                  orderDatas[i].data.push(v);
                  orderDatas[i].count += v.count;
                  orderDatas[i].total += v.count * v.price;
                  return;
                }
              }

              let o = {};
              o.oid = v.oid;
              o.count = v.count;
              o.total = v.count * v.price;
              o.status = v.status;
              o.date = v.createdAt;
              o.data = [v];

              orderDatas.push(o);
              orderDatas.reverse(orderDatas)
            })
              this.orderData = orderDatas;
          }

        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

    // 确定收货
    receivePro(item,index) {
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
        method: "POSt",

        url: "/receive",
        // 参数
        data: {
          appkey:this.appkey,
          tokenString,
          oid:item.oid
        }
      })
        .then((result) => {
          // 
          this.$toast.clear();

          if (result.data.code == 700 ) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if(result.data.code == 80000) {
            
            if(this.activeIndex == 1 ) {

              this.orderData.splice(index , 1)
            }
            
            item.status = 2;
            
          }

          this.$toast(result.data.msg)

        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

    // 删除订单
    removePro(oid , index) {
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
        method: "POSt",

        url: "/removeOrder",
        // 参数
        data: {
          appkey:this.appkey,
          tokenString,
          oid:oid
        }
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700 ) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if(result.data.code == 90000) {
            this.orderData.splice(index, 1)
          }
          this.$toast(result.data.msg)
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    }
  },
};
</script>