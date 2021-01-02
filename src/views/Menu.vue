<template>
  <div class="menu">
    <div class="menu-nav">
      <div class="menu-search">
        <van-search placeholder="输入商品名称" @focus="searchPro"/>
      </div>

      <div class="menu-option">
        <div
          class="menu-item"
          v-for="(item, index) in menuOptions"
          :key="index"
          @click="togglePage(index, item.type)"
        >
          <div class="m-item">
            <div class="m-icon">
              <img
                class="auto-img"
                :src="item.inactiveIcon"
                alt=""
              />
            </div>
            <div class="m-text" :class="{ active: activeIndex == index }">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品列表 -->
		<div class="product-box">

			<div class="product-list">
				<div
					class="list-item"
					v-for="(item, index) in productData"
					:key="index"
					@click="goDetails(item.pid)"
				>
					<div class="pro-img fl">
						<img class="auto-img" :src="item.smallImg" alt="" />
					</div>
					<div class="pro-title fl">
						<span>{{ item.name }}</span>
					</div>
					<div class="pro-title-vice fl">
						<span>{{ item.enname }}</span>
					</div>
					<div class="price fl">
						<span>￥28.00</span>
					</div>
				</div>
			</div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
export default {
	name: "Menu",
	
	data() {
		return {
			activeIndex:0,

			productData:[],
			menuOptions: [
        {
          title: "推荐",
          inactiveIcon: require("../assets/images/icons_09.gif"),
          activeIcon: require("../assets/images/icons_21.gif"),
        },
        {
          title: "拿铁",
          inactiveIcon: require("../assets/images/icons_05.gif"),
          activeIcon: require("../assets/images/icons_19.gif"),
        },
        {
          title: "咖啡",
          inactiveIcon: require("../assets/images/icons_03.gif"),
          activeIcon: require("../assets/images/icons_18.gif"),
        },
        {
          title: "瑞纳冰",
          inactiveIcon: require("../assets/images/icons_07.gif"),
          activeIcon: require("../assets/images/icons_20.gif"),
        },
      ],
		}
	},

	created() {
		// 获取商品类型
		this.getType();
	},

	methods: {
		// 切换菜单商品
		togglePage(index , type) {
			if(this.activeIndex == index) {
				return
			};

			this.activeIndex = index;

			this.getproductType(type)
		},

		// 获取商品类型
		getType() {
		
      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "GET",

        url: "/type",
        // 参数
        params: {
          appkey: this.appkey,
        
        },
      })
        .then((result) => {
          // 
          this.$toast.clear();

					if ( result.data.code == 400 ) {
            let data = result.data.result;
            // 往数组的头部插入推荐数据
						data.unshift({
							type:'isHot',
							typeDesc:'推荐'
						})

						this.menuOptions.map(v=> {
							for(let i = 0 ; i < data.length ; i++) {
								if(v.title == data[i].typeDesc) {
									v.type = data[i].type;
									break;
								}
							}
						})

						let type = this.menuOptions[this.activeIndex].type

						this.getproductType(type)
					}

          
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
		},

		// 获取商品数据
		getproductType(type) {
			let params = {
				appkey:this.appkey
			};

      // 判断商品数据（推荐）
			if( type == "isHot" ) {

				params.key = 'isHot';
        params.value = 1;
        
			}else {
        // 获取数据的type
				params.key = 'type';
				params.value= type;
			}

			this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });

      // 发起请求
      this.axios({
        method: "GET",

        url: "/typeProducts",
        // 参数
        params
      })
        .then((result) => {
          // 
          this.$toast.clear();
          if(result.data.code == 500 ) {
						this.productData = result.data.result;	
						// 
					}
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
		},

		//查看商品详情
		goDetails(pid) {
			this.$router.push({name:'Details' ,params:{pid}})
		},

		// 搜索商品
		searchPro() {
			this.$router.push({name:'Search'})
		}
	}
};
</script>

<style lang="less" scoped>
</style>