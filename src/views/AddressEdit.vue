<template>
  <div class="address">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <van-address-edit
      :area-list="areaList"
      show-postal
      show-set-default
      :show-delete="!!aid"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      save-button-text="保存地址"
      delete-button-text="删除地址"
			:address-info="addRess"
      @save="seve"
			@delete="removeRess"
    />
  </div>
</template>

<script>
import areaList from "../assets/js/area";
export default {
  name: "AddressEdit",
  data() {
    return {
			// 城市数据
      areaList,

			// 地址aid
			aid: "",
			
			// 地址初始值
			addRess:{}
    };
  },
  created() {
    // 截取参数 判断是新增地址还是编辑地址
		this.aid = this.$route.query.aid;
		
		// 根据aid是否有值
		if(this.aid) {
			this.getResslist();
		}
  },
  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    //保存地址
    seve(content) {
      // 获取token
      let tokenString = localStorage.getItem("__log");
      // 
      if (!tokenString) {
        this.$toast("请先登录");
        return this.$router.push({ name: "Login" });
			}
			
			// 记录保存的内容
      let addRess = Object.assign({}, content);

      // 

      // 删除country
      delete addRess.country;

      addRess.tokenString = tokenString;
      addRess.appkey = this.appkey;

      addRess.isDefault = Number(addRess.isDefault);

      this.$toast.loading({
        message: "加载中..",
        forbidClick: true,
        duration: 0,
      });
			
			if( !this.aid ) {

				// 新增地址
				this.addRessEdit(addRess , '/addAddress');
			} else {
				// 校验地址信息是否被修改过

				let isMod = false;

				for( let key in this.addRess ) {
					if(content[key] != this.addRess[key]) {
						this.$toast('用户已修改地址信息')
						isMod = true;
					}
				}

				if(isMod) {
					// 发起编辑地址请求
					this.addRessEdit(addRess , '/editAddress')
				}else {
					return this.$toast('地址信息未修改')
				}
			}
		},

		// 地址的编辑或新增
		addRessEdit(addRess , url) {
			// 发起请求
      this.axios({
        method: "POST",

        url,
        // 参数
        data: addRess,
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if (result.data.code == 9000 || result.data.code == 30000 ) {

						// 跳转地址列表
						setTimeout(() => {
              // this.$router.push({name:'Addresslist'})
              this.back();
            },800)
            
            // 没有找到自动返回
            // this.$toast('您的地址信息已修改完成！')
          }

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
		},

		// 查询地址列表数据
		getResslist() {
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

        url: "/findAddressByAid",
        // 参数
        params: {
					appkey:this.appkey,
					tokenString,
					aid:this.aid
				}
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if( result.data.code == 40000 ) {
						result.data.result[0].isDefault = Boolean(result.data.result[0].isDefault)

						this.addRess = result.data.result[0]
						
					}

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
		},
		
		// 删除地址
		removeRess() {
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

        url: "/deleteAddress",
        // 参数
        data: {
					appkey:this.appkey,
					tokenString,
					aid:this.aid
				}
      })
        .then((result) => {
          
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if(result.data.code == 10000 ) {

						// 延迟函数，跳转地址列表
						setTimeout(() => {
              // this.$router.push({name:'Addresslist'})
              this.back();
						},800)
					}

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
		}
  },
};
</script>

<style lang="less" scoped>
.address {
  padding-top: 46px;

  /deep/ .van-button--danger {
    margin-top: 20px;
    margin-bottom: 20px;
    background-color: #bd7833;
    border-color: #bd7833;
  }
  /deep/ .van-switch--on {
    background: #bd7833;
  }
  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar .van-icon {
    color: #bd7833;
  }
  /deep/ .van-nav-bar__title {
    font-weight: 600;
  }
}
</style>