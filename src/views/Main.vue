<template>
  <div class="main">
    <!-- 二级路由 -->
    <div>
      <router-view></router-view>
    </div>

		<!-- 菜单tab切换 -->
    <van-tabbar v-model="activeName" active-color="#e8ae75" route fixed>
      <van-tabbar-item
        replace
        :to="item.path"
        v-for="(item, index) in tabbarData"
        :key="index"
        :icon="item.icon"
      >
        <span>{{ item.title }}</span>

        <template #icon="props">
          <img :src="props.active ? item.activeImg : item.Img" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "Main",

  data() {
    return {
			activeName: "Home",
			
			// 菜单tab数据
      tabbarData: [
        {
          title: "首页",
          icon: "home-o",
          name: "Home",
          path: "/main/home",
          Img: require("../assets/images/crown.png"),
          activeImg: require("../assets/images/crown_active.png"),
        },
        {
          title: "饮品",
          icon: "search",
          name: "Menu",
          path: "/main/menu",
          Img: require("../assets/images/coffee.png"),
          activeImg: require("../assets/images/coffee_active.png"),
        },
        {
          title: "购物车",
          icon: "friends",
          name: "Shopcar",
          path: "/main/shopcar",
          Img: require("../assets/images/shopcar.png"),
          activeImg: require("../assets/images/shopcar_active.png"),
        },
        {
          title: "我的",
          icon: "setting",
          name: "My",
          path: "/main/my",
          Img: require("../assets/images/my.png"),
          activeImg: require("../assets/images/my_active.png"),
        },
      ],
    };
  },
};
</script>