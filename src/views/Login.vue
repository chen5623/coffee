<template>
  <div class="login">
    <div class="bg-box"></div>
    <van-nav-bar right-text="游客" @click-right="goHome('Home')">
      <template #left>
        <div class="logo-box">
          <div class="logo">
            <img src="../assets/images/crown_active.png" />
          </div>
          <div class="logo-txt">Crown coffee</div>
        </div>
      </template>
    </van-nav-bar>

    <div class="box-title">
      <div class="wel-box"></div>

      <van-form>
        <van-field
          v-model="loginData.phone"
          name="手机号"
          label="手机号"
          placeholder="请输入手机号"
          autocomplete="off"
          class="ipt"
        />
        <van-field
          v-model="loginData.password"
          :type="isLoginPassword ? 'password' : 'text'"
          name="密码"
          label="密码"
          placeholder="请输入密码"
          autocomplete="off"
          :right-icon="isLoginPassword ? 'closed-eye' : 'eye-o'"
          @click-right-icon="toggleLoginPassword"
          class="ipt"
        />

        <div class="forpass" @click="goHome('Forgot')">忘记密码?</div>
        <div style="margin: 16px">
          <van-button round block type="info" color="#d19358" @click="islogin">
            登&nbsp;录
          </van-button>
        </div>

        <div class="logup">
          <van-button round block type="default" @click="toggleLogup">
            注&nbsp;册
          </van-button>
        </div>
      </van-form>
    </div>

    <van-popup v-model="isShow" position="bottom" closeable class="logup-box">
      <div class="crown">皇冠</div>
      <van-field
        v-model="logupData.nickName"
        name="昵称"
        label="昵称"
        placeholder="请输入昵称"
        autocomplete="off"
      />
      <van-field
        v-model="logupData.phone"
        name="手机号"
        label="手机号"
        placeholder="请输入手机号"
        autocomplete="off"
      />
      <van-field
        v-model="logupData.password"
        :type="isPassword ? 'password' : 'text'"
        name="密码"
        label="密码"
        placeholder="请输入密码"
        autocomplete="off"
        :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
        @click-right-icon="togglePasswordType"
      />
      <div class="logup bot">
        <van-button round block type="default" @click="register">
          注册
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/login.less";

import { validForm } from "../assets/js/validForm";

export default {
  name: "Login",

  data() {
    return {
      // 用户登录信息
      loginData: {
        phone: "",
        password: "",
      },

      // 用户注册信息
      logupData: {
        nickName: "",
        password: "",
        phone: "",
      },
      // 注册密码框切换type
      isPassword: true,

      // 登录密码框切换type
      isLoginPassword: true,

      // 注册框显示隐藏
      isShow: false,
    };
  },

  methods: {
    // 注册密码框事件
    togglePasswordType() {
      this.isPassword = !this.isPassword;
    },
    // 登录密码框事件
    toggleLoginPassword() {
      this.isLoginPassword = !this.isLoginPassword;
    },
    // 显示注册框事件
    toggleLogup() {
      this.isShow = true;
    },
    // 注册逻辑事件
    register() {
      let pot = {
        nickName: {
          value: this.logupData.nickName,
          errorMsg: "昵称格式不正确",
          reg: /^[\w\u4e00-\u9fa5]{1,10}$/,
        },
        phone: {
          value: this.logupData.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.logupData.password,
          errorMsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };
      let isPass = validForm.valid(pot);

      if (isPass) {
				// 获取注册信息
        let userInfo = Object.assign({}, this.logupData);
        //

        userInfo.appkey = this.appkey;

        this.$toast.loading({
          message: "加载中..",
          forbidClick: true,

          duration: 0,
        });

        this.axios({
          method: "POST",

          url: "/register",

          data: userInfo,
        })
          .then((result) => {
            //
            this.$toast.clear();
            if (result.data.code == 100) {
              this.isShow = false;
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },
    // 登录
    islogin() {
      let opt = {
        phone: {
          value: this.loginData.phone,
          errorMsg: "手机号格式不正确",
          reg: /^1[3-9]\d{9}$/,
        },
        password: {
          value: this.loginData.password,
          errorMsg: "密码格式不正确",
          reg: /^[A-Za-z]\w{5,15}$/,
        },
      };

      let isPass = validForm.valid(opt);
      if (isPass) {
        let userInfo = Object.assign({}, this.loginData);

        userInfo.appkey = this.appkey;

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        this.axios({
          method: "POST",
          url: "/login",

          data: userInfo,
        })
          .then((result) => {
            this.$toast.clear();

            // 登录成功
            if (result.data.code == 200) {
              localStorage.setItem("__log", result.data.token);

              // 跳转页面
              this.$router.push({ name: "Home" });
            } else {
              this.$toast(result.data.msg);
            }
          })
          .catch((err) => {
            this.$toast.clear();
          });
      }
    },

		// 跳转页面
    goHome(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="less" scoped>
</style>