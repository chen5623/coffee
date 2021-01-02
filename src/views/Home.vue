<template>
  <div class="home">

		<!-- 导航栏 -->
    <div class="nav-box">
      <div class="nav-title">
        <div class="titel-1">
          <span class="t1">嗨，下午好</span>
        </div>
      </div>
      <van-nav-bar>
        <template #right>
          <van-search placeholder="请输入商品名称" @focus="searchPro" />
        </template>
      </van-nav-bar>
    </div>

			<!-- 内容区 -->
      <div class="home-centent">

				<!-- 轮播图 -->
        <div class="banner-box">
          <van-swipe @change="changeIndex" :autoplay="3500" loop>
            <van-swipe-item v-for="(item, index) in bannerData" :key="index">
              <img class="auto-img" :src="item.bannerImg" @click="goDetails(item.pid)"/>
            </van-swipe-item>

						<!-- 导航点 -->
            <template #indicator>
              <div class="banner-index">
                <div
                  :class="{ active: index == currentIndex }"
                  v-for="(item, index) in 4"
                  :key="index"
                ></div>
              </div>
            </template>
          </van-swipe>
        </div>

				<div class="product-box">
					<div>
						<!-- 商品标题 -->
						<div class="coffee-title">
							<span>咖啡就像人生，苦与甜混合其中</span>
						</div>

						<!-- 商品列表 -->
						<div class="product-list">
							<div class="list-item" v-for="(item,index) in hotData" :key="index" @click="goDetails(item.pid)">
								<div class="pro-img fl">
									<img class="auto-img" :src="item.smallImg" alt="">
								</div>
								<div class="pro-title fl">
									<span>{{item.name}}</span>
								</div>
								<div class="pro-title-vice fl">
									<span>{{item.enname}}</span>
								</div>
								<div class="price fl">
									<span>￥28.00</span>
								</div>
							</div>
						</div>

					</div>
				</div>
      </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
export default {
  name: "Home",
  data() {
    return {
      // 导航下标
      currentIndex: 0,

      // 轮播图数据
      bannerData: [],
      // 商品数据
      hotData: [],

    };
  },
  created() {
		// 调用获取轮播图数据的方法
		this.getBannerData();
		// 调用获取商品数据的方法
    this.getHotData();
    
  },
  methods: {
		// 改变轮播图的索引值
    changeIndex(index) {
      this.currentIndex = index;
    },

		// 获取轮播图的数据
    getBannerData() {
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,

        duration: 0,
      });

			// 发送请求
      this.axios({
				// 请求类型
        method: "GET",
				// 请求路径
        url: "/banner",
				// 请求参数
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },
    
		// 获取商品
    getHotData() {
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,

        duration: 0,
      });

      this.axios({
        method: "GET",

        url: "/typeProducts",

        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((result) => {
          this.$toast.clear();

          // 判断
          if (result.data.code == 500) {
            this.hotData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
		},

    // 跳转详情页面页面
		goDetails(pid) {
			this.$router.push({name:'Details',params:{pid}});
    },
    
    // 搜索商品
		searchPro() {
			this.$router.push({name:'Search'})
		}
  },
};
</script>