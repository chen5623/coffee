<template>
  <div class="shopcar">
    <van-nav-bar
      title="购物车"
      :left-text="isback ? '返回' : ''"
      :left-arrow="isback"
      @click-left="goto"
      @click-right="isCarpro = !isCarpro"
      fixed
    >
      <template #right>
        <div v-if="shopData.length > 0">{{ isCarpro ? "完成" : "编辑" }}</div>
      </template>
    </van-nav-bar>
    <div v-if="shopData.length == 0">
      <van-empty description="购物车空空如也，去逛一逛">
        <van-button round type="danger" class="bottom-button" @click="gohome">
          逛一逛
        </van-button>
      </van-empty>
    </div>
    <div class="shopcar-box" v-else>
      <div class="shopcar-bg">
      </div>

      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="别拉了，我就那么多了"
        offset="20"
        @load="isLoading"
      >
        <div class="shopcar-pro">
          <div
            class="shopcar-item clear"
            v-for="(item, index) in shopData"
            :key="item.sid"
          >
            <van-swipe-cell :disabled="!isCarpro">
              <div class="item-left fl">
                <van-checkbox v-model="item.isChecked" @click="oneChecked" />
              </div>
              <div class="item-right fl">
                <div class="right-img fl">
                  <img class="auto-img" :src="item.small_img" alt="" />
                </div>
                <div class="right-item fl">
                  <div class="item-top clear">
                    <div class="item-name fl">{{ item.name }}</div>
                    <div class="item-pro fl">{{ item.rule }}</div>
                  </div>
                  <div class="item-enname">{{ item.enname }}</div>
                  <div class="item-bottom clear">
                    <div class="price fl">￥{{ item.price }}</div>
                    <div class="pro-count fr">
                      <van-stepper
                        v-model="item.count"
                        theme="round"
                        button-size="20"
                        disable-input
                        @change="iscount(item)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <template #right>
                <van-button
                  square
                  type="danger"
                  text="删除"
                  @click="removeItem(index , item.sid)"
                />
              </template>
            </van-swipe-cell>
          </div>
        </div>
      </van-list>
    </div>
    
    <div v-if="shopData.length != 0">
      <van-submit-bar
        v-if="!isCarpro"
        button-color="#bd7833"
        color="#bd7833"
        :price="isSum"
        button-text="提交订单"
        @submit="commit"
      >
        <van-checkbox v-model="isAllcheck" @click="allChecked">全选</van-checkbox>
      </van-submit-bar>

      <van-submit-bar
        v-else
        button-color="#bd7833"
        button-text="删除选择"
        @submit="removeCount"
      >
        <van-checkbox v-model="isAllcheck" @click="allChecked">全选</van-checkbox>
      </van-submit-bar>
    </div>

  </div>
</template>

<script>
import "../assets/less/shopcar.less";
export default {
  name: "Shopcar",

  data() {
    return {
      // 商品数量
      count: 1,

      // 商品数据
      allProductData: [],

      // 购物车的删除选项
      isRemove: true,

      // 购物车是否处于编辑状态
      isCarpro: false,

      // 全选
      isAllcheck: false,

      // 订单总价
      isSum: 0,

      // 触发加载
      loading: true,

      // 是否加载数据
      finished: false,

      // 购物车数据
      shopData: [],

      // 渲染数据的数量
      proCount: 8,

      // 截取的位置
      startIndex: 0,

      isback: "",
    };
  },

  created() {
    // 查询购物车商品数据
    this.getShopcarPro();

    // 作购物车在下边tab栏进去时没有返回按钮
    let one = typeof "one";
    let two = typeof this.$route.params.pid;
    this.isback = one == two;
  },
  methods: {
    // 返回上一级
    goto() {
      this.$router.go(-1);
    },

    // 获取购物车商品数据
    getShopcarPro() {
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

        url: "/findAllShopcart",
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
          } else if (result.data.code == 5000) {
            // 给商品添加复选框的属性状态
            result.data.result.map((v) => {
              v.isChecked = false;
            });

            this.allProductData = result.data.result;

            // 根据渲染的数量和截取位置设置购物车显示的数据
            this.shopData = this.allProductData.slice(
              this.startIndex,
              this.startIndex + this.proCount
            );

            // 每次裁剪加上上一次裁剪的数量
            this.startIndex += this.proCount;

            // 不加载
            this.loading = false;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

    // 全选
    allChecked() {
      // 遍历全部商品 ， 是否选中由全选决定
      this.allProductData.map((v) => {
        v.isChecked = this.isAllcheck;
      });

      // 调用计算订单总金额方法
      this.Sum();
    },

    // 单选
    oneChecked() {
      // 计算订单总金额方法
      this.Sum();

      // 遍历商品
      for (let i = 0; i < this.allProductData.length; i++) {
        // 判断是否存在不选中的商品
        if (!this.allProductData[i].isChecked) {
          // 若有，则全选框不选中
          this.isAllcheck = false;
          return;
        }
      }
      // 全选框选中
      this.isAllcheck = true;
    },

    Sum() {
      // 金额初始化
      this.isSum = 0;
      // 计算选中的商品
      this.allProductData.map((v) => {
        if (v.isChecked) {
          this.isSum += v.count * v.price;
        }
      });

      // 金额转换
      this.isSum *= 100;
    },

    // 数量
    iscount(item) {
			// this.Sum();
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

        url: "/modifyShopcartCount",
        // 参数
        data: {
          appkey: this.appkey,
					tokenString,
					sid: item.sid,
					count: item.count
        },
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          }else if(result.data.code == 6000) {
						if(item.isChecked) {
							this.Sum()
						}
					}
					this.$toast(result.data.msg)
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

    //删除当前点击的删除按钮代表的商品
    removeItem(index ,sid) {
			
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

        url: "/deleteShopcart",
        // 参数
        data: {
          appkey: this.appkey,
					tokenString,
					sids:JSON.stringify([sid])

        },
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          }else if(result.data.code == 7000) {
						this.shopData.splice(index, 1);
						this.Sum();
					}

					this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
		},
		// 判断是否勾选商品
		isSelectPro(msg) {
			for(let i = 0 ; i < this.shopData.length ; i ++) {
				if(this.shopData[i].isChecked) {
					return true
				}
			}

			return false;
		},
    // 删除选择
    removeCount() {

			let isHas = this.isSelectPro();
			if(!isHas) {
				this.$toast('请选择删除的商品')
				return;
			}

			// 勾选商品集合
			let sids = [];
			this.shopData.map(v => {
				if(v.isChecked) {
					sids.push(v.sid);
				}
			})
			
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

        url: "/deleteShopcart",
        // 参数
        data: {
          appkey: this.appkey,
					tokenString,
					sids: JSON.stringify(sids)

        },
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          }else if(result.data.code == 7000) {
						for(let i = 0; i < this,this.shopData.length ; i ++ ){
							if(this.shopData[i].isChecked) {
								this.shopData.splice(i , 1 );
								i--;
							}
						}

						this.Sum();
					}

					this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

    // 懒加载数据
    isLoading() {
      setTimeout(() => {
        // 在购物车所有的数据数组中截取数据
        let data = this.allProductData.slice(
          this.startIndex,
          this.startIndex + this.proCount
        );

        // 截取的位置累加
        this.startIndex += this.proCount;

        // 往购物车数据中添加截取的数据
        this.shopData.push(...data);

        // 没加载的数据小于要截取数据的长度时
        if (data.length < this.proCount) {
          // 没有数据可加载时，将finished改为true ，禁止onload事件
          this.finished = true;
        } else {
          // 每次加载时要将loading改为false
          this.loading = false;
        }
      }, 1500);
		},
		
		// 订单
		commit() {

			let isHas = this.isSelectPro();
			if(!isHas) {
				this.$toast('请选择您要购买的商品')
				return;
			}

			let sids = [];

			this.shopData.map( v => {
				if(v.isChecked) {
					sids.push(v.sid)
				}
			})

			this.$router.push({name:'Indent',query:{sids:sids.join('-')}})
    },
    
    // 逛一逛
    gohome() {
      this.$router.push({name:'Home'})
    }
  },
};
</script>

<style lang="less" scoped>
</style>