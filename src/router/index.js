import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // 登录页面
  {
    path:'/login',
    name:'Login',
    component: () => import('../views/Login.vue')
  },
  // 首页
  {
    path:'/main',
    name:'Main',
    component:() => import('../views/Main.vue'),

    children:[
      {
        path:'home',
        name:'Home',
        component:() => import('../views/Home.vue')
      },
      {
        path:'menu',
        name:'Menu',
        component:() => import('../views/Menu.vue')
      },
      {
        path:'shopcar',
        name:'Shopcar',
        component:() => import('../views/Shopcar.vue')
      },
      {
        path:'my',
        name:'My',
        component:() => import('../views/My.vue')
      }
    ]
  },
  // 商品详情页
  {
    path:'/details/:pid',
    name:'Details',
    component: ()  => import('../views/Details.vue')
  },
  // 订单页面
  {
    path:'/indent',
    name:'Indent',
    component:() => import('../views/Indent.vue')
  },
  // 地址
  {
    path:'/addressEdit',
    name:'AddressEdit',
    component:() => import('../views/AddressEdit.vue')
  },
  // 地址列表
  {
    path:'/addresslist',
    name:'Addresslist',
    component:() => import('../views/Addresslist.vue')
  },
  // 订单详情
  {
    path:'/order',
    name:'Order',
    component:() => import('../views/Order.vue')
  },
  // 个人资料
  {
    path:'/myInfo',
    name:'MyInfo',
    component:() => import('../views/MyInfo.vue')
  },
  // 我的收藏
  {
    path:'/link',
    name:'Link',
    component:() => import('../views/Link.vue')
  },
  // 安全中心
  {
    path:'/safe',
    name:'Safe',
    component:() => import('../views/Safe.vue')
  },
   // 搜索
   {
    path:'/search',
    name:'Search',
    component:() => import('../views/Search.vue')
  },

  {
    path:'/forgot',
    name:'Forgot',
    component:() => import('../views/Forgot.vue')
  },


  {
    path:'*',

    redirect: {name:'Home'}
  }
]

const router = new VueRouter({
  routes
})

export default router
