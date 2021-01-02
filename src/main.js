import Vue from 'vue'
import App from './App.vue'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'

import  'lib-flexible/flexible'

import { 
  Button ,
  NavBar,
  Form,
  Field,
  Popup,
  Toast,
  Tabbar,
  TabbarItem,
  Search,
  Swipe, 
  SwipeItem,
  Stepper,
  GoodsAction, 
  GoodsActionIcon, 
  GoodsActionButton,
  Empty,
  Checkbox,
  SwipeCell,
  SubmitBar,
  List,
  AddressEdit,
  AddressList,
  Icon,
  Dialog,
  Tab,
  Tabs,
  Cell,
  CellGroup,
  Uploader
} from 'vant'

Vue
  .use(Button)
  .use(NavBar)
  .use(Form)
  .use(Field)
  .use(Popup)
  .use(Toast)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Search)
  .use(Swipe)
  .use(SwipeItem)
  .use(Stepper )
  .use(GoodsAction)
  .use(GoodsActionButton)
  .use(GoodsActionIcon)
  .use(Empty)
  .use(Checkbox)
  .use(SwipeCell)
  .use(SubmitBar)
  .use(List)
  .use(AddressEdit)
  .use(AddressList)
  .use(Icon)
  .use(Dialog)
  .use(Tab)
  .use(Tabs)
  .use(Cell)
  .use(CellGroup)
  .use(Uploader)

// 配置Vue原型属性 key值
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=';

// 配置请求基础路径
axios.defaults.baseURL = 'http://www.kangliuyong.com:10002';

// axios拦截器 在发起请求之前执行
axios.interceptors.request.use(config => {
  // 
  if(config.method == 'post') {
    let paramsString ='';

    for(let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }

    config.data = paramsString.slice(0,-1);
  }

  return config
})

// 全局过滤器
Vue.filter('formatDate' ,(v , format) => {
  // 创建日期对象
  let date = new Date(v);

  // 格式化年份
  let year = date.getFullYear().toString();

  
  if(/(y+)/.test(format)) {
    // 获取匹配组的内容
    let content = RegExp.$1;

    format = format.replace(content,year.slice(year.length - content.length))
  }


  // 格式化月份，日， 时 分 秒
  let o = {
    M:date.getMonth() + 1,
    d:date.getDate(),
    h:date.getHours(),
    m:date.getMinutes(),
    s:date.getSeconds()
  };
  for(let key in o) {
    // 创建动态正则表达式
    let reg = new RegExp(`(${key}+)`);


    if(reg.test(format)) {
      // 获取组匹配的内容
      let groupContent = RegExp.$1;

      format = format.replace(groupContent, o[key] >= 10 ? o[key] : groupContent.length == 2 ? '0'+o[key] : o[key] )
    }

    // 
  }

  return format;
})

Vue.use(VueAxios,axios)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
