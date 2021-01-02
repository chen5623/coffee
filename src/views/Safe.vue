<template>
  <div class="safe">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <div class="order-bg"></div>
    <div class="safe-box">
      <div class="safe-item">
        <van-cell title="修改密码" is-link @click="passwordBox" />

        <van-cell title="注销账号" is-link @click="destroyAccount" />
      </div>

      <div class="logout-box">
        <van-button color="#bd7833" block round @click="logout"
          >退出登录</van-button
        >
      </div>

      <van-popup is-link position="bottom" closeable v-model="isOpen">
        <div class="form-box">
          <div class="form-title">修改密码</div>
          <van-form>
            <van-field
              v-model="password.oldPassword"
              :type="isPassword ? 'password' : 'text'"
              name="旧密码"
              label="旧密码"
              placeholder="旧密码(首字符须为字母)"
              :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
              autocomplete="off"
              @click-right-icon="toggleType"
            />

            <van-field
              v-model="password.newPassword"
              :type="isPassword ? 'password' : 'text'"
              name="新密码"
              label="新密码"
              placeholder="新密码(首字符必须为字母)"
              :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
              autocomplete="off"
              @click-right-icon="toggleType"
            />

            <div class="commit-btn">
              <van-button round block color="#bd7833" @click="commit">提交</van-button>
            </div>
          </van-form>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
import {validForm} from '../assets/js/validForm'
export default {
  name: "Safe",
  data() {
    return {
      isOpen: false,
      isPassword: true,
      password: {
        oldPassword: "",
        newPassword: "",
      },
    };
  },

  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    // 切换密码框类型
    toggleType() {
      this.isPassword = !this.isPassword;
    },

    // 修改密码部分显示与否
    passwordBox() {
      this.isOpen = true;
    },
    //退出登录
    logout() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确定退出登录！",
          confirmButtonColor: "#0C34BA",
        })
        .then(() => {
          //执行退出登录
          //清除登录状态
          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });
          // console.log(result)

          setTimeout(() => {
            this.$toast.clear();
            localStorage.removeItem("__log");
            this.$router.push({ name: "Login" });
          }, 800);
        })
        .catch((err) => {});
    },

    // 账号注销
    destroyAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确定注销账号，一经注销无法恢复",
          confirmButtonColor: "#bd7833",
        })
        .then(() => {
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

            url: "/destroyAccount",
            // 参数
            data: {
              appkey: this.appkey,
              tokenString,
            },
          })
            .then((result) => {
              
              this.$toast.clear();

              if (result.data.code == 700) {
                // 登录失效，token校验不成功
                this.$router.push({ name: "Login" });
              } else if (result.data.code == "G001") {
                setTimeout(() => {
                  //清除登录状态
                  localStorage.removeItem("__log");
                  this.$router.push({ name: "Login" });
                }, 800);
              }
              this.$toast(result.data.msg)
            })
            .catch((err) => {
              this.$toast.clear();
              // 
            });
        });
    },

    // 修改密码
    commit() {

      //构造表单验证信息
      let o = {
        oldPassword: {
          value: this.password.oldPassword,
          errorMsg: "旧密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
        newPassword: {
          value: this.password.newPassword,
          errorMsg: "新密码由数字字母下划线组合(6-16字符)",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      let isPass = validForm.valid(o);
      if(isPass) {
        if(this.password.newPassword == this.password.oldPassword) {
          this.$toast('新密码不能与旧密码相同')
          return;
        }
        }
      
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

            url: "/updatePassword",
            // 参数
            data: {
              appkey: this.appkey,
              tokenString,
              password:this.password.newPassword,
              oldPassword:this.password.oldPassword
            },
          })
            .then((result) => {
              
              this.$toast.clear();

              if (result.data.code == 700) {
                // 登录失效，token校验不成功
                this.$router.push({ name: "Login" });
              } else if ( result.data.code == 'E001') {
                setTimeout(() => {
                  //清除登录状态
                  localStorage.removeItem("__log");
                  this.$router.push({ name: "Login" });
                }, 800);
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
.safe {
  padding-top: 50px;
  .order-bg {
    border-radius: 10px;
    overflow: hidden;
    height: 100px;
    background: url("../assets/images/coffee-bg.jpg") no-repeat center center;
    background-size: 100% 100%;
  }
  .safe-box {
    padding: 10px;
    margin-top: -20px;
  }
  .safe-item {
    background-color: white;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    overflow: hidden;
  }
  .logout-box {
    margin-top: 160px;
  }
  /deep/ .van-cell {
    &:active {
      background-color: white;
    }
  }
  /deep/ .van-nav-bar .van-icon,
  /deep/ .van-nav-bar__text {
    color: #bd7833;
  }
  .form-box {
    padding: 15px;
  }

  .form-title {
    margin-bottom: 30px;
    font-size: 16px;
  }

  .commit-btn {
    margin-top: 50px;
  }
}
</style>