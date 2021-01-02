<template>
  <div class="login">
    <div class="bg-box"></div>
    <van-nav-bar>
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

      <van-form v-show="!isNext">
        <van-field
          v-model="loginData.email"
          name="邮箱"
          label="邮箱"
          placeholder="请输入邮箱"
          autocomplete="off"
          class="ipt"
        />
        <van-field
          v-model="loginData.code"
          name="验证码"
          label="验证码"
          placeholder="请输入验证码"
          autocomplete="off"
          class="ipt"
        >
          <template #button>
            <van-button size="small" type="primary" @click="getValidCode" :disabled="isSend" >{{
              text
            }}</van-button>
          </template>
        </van-field>

        <div class="forpass" @click="goHome('Login')">.</div>
        <div style="margin: 16px">
          <van-button round block type="info" color="#d19358" @click="register">
            下一步
          </van-button>
        </div>

        <div class="logup">
          <van-button round block type="default" @click="back">
            返回登录
          </van-button>
        </div>
      </van-form>
      <van-form v-show="isNext">
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

        <div class="forpass" @click="goHome('Login')">已有账号？前往登录</div>
        <div style="margin: 16px">
          <van-button round block type="info" color="#d19358" @click="commit">
            提&nbsp;交
          </van-button>
        </div>

        <div class="logup">
          <van-button round block type="default" @click="back">
            返回登录
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import "../assets/less/login.less";

import { validForm } from "../assets/js/validForm";

export default {
  name: "Forgot",

  data() {
    return {
      // 用户提交信息
      loginData: {
        phone: "",
        password: "",
        email: "",
        code: "",
      },

      isSend:false,

      text: "发送验证码",

      // 登录密码框切换type
      isLoginPassword: true,

      // 是否下一步
      isNext: false
    };
  },

  methods: {
    back() {
      this.$router.go(-1);
    },

    // 忘记密码框事件
    toggleLoginPassword() {
      this.isLoginPassword = !this.isLoginPassword;
    },

    // 验证表单信息
    register() {
      let pot = {
        email: {
          value: this.loginData.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
        code: {
          value: this.loginData.code,
          errorMsg: "验证码格式不正确",
          reg: /^[A-Za-z\d]{6}$/,
        },
        
      };
      let isPass = validForm.valid(pot);

      if (isPass) {
        // 验证码请求
        this.$toast.loading({
          message: "加载中..",
          forbidClick: true,

          duration: 0,
        });

        this.axios({
          method: "POST",

          url: "/checkValidCode",

          data: {
            appkey: this.appkey,
            validCode: this.loginData.code,
          },
        })
          .then((result) => {
            this.$toast.clear();
            // 
            this.$toast(result.data.msg)

            if(result.data.code == 'K001') {
              this.isNext = true;
            }
          })
          .catch((err) => {
            this.$toast.clear();
            
          });
      }
    },

    // 获取验证码
    getValidCode() {
      let pot = {
        email: {
          value: this.loginData.email,
          errorMsg: "邮箱格式不正确",
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
        },
      };

      let isHas = validForm.valid(pot);

      if (!isHas) {
        return;
      }

      let time = 60;

      this.isSend = true;
      this.text = `${time}秒后重新发送`;

      let timer = setInterval(() => {
        if (time <= 0) {
          clearInterval(timer);
          timer = null;
          time = 60;
          this.isSend = false;
        } else {
          time--;
          this.text = `${time}秒后重新发送`;
        }
      }, 1000);

      //发起获取验证码请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求类型
        method: "POST",
        //请求路径
        url: "/emailValidCode",

        //POST请求参数, object
        data: {
          appkey: this.appkey,
          email: this.loginData.email,
        },
      })
        .then((result) => {
          this.$toast.clear();

          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 提交表单信息
    commit() {
      //构造表单验证信息
        let opt = {
          phone: {
            value: this.loginData.phone,
            errorMsg: '手机号格式不正确',
            reg: /^1[3-9]\d{9}$/
          },
          password: {
            value: this.loginData.password,
            errorMsg: '新密码由数字字母下划线组合(6-16字符)',
            reg: /^[A-Za-z]\w{5,15}$/
          }
        };

        let isPass = validForm.valid(opt);
        if (isPass) {
  
          this.$toast.loading({
            message: '加载中...',
            forbidClick: true,
            duration: 0
          });

          //发起找回密码请求
          this.axios({
            //请求类型
            method: 'POST',
            //请求路径
            url: '/retrievePassword',

            //POST请求参数, object
            data: {
              appkey: this.appkey,
              phone: this.loginData.phone,
              password: this.loginData.password
            }

          }).then(result => {
            this.$toast.clear();

            this.$toast(result.data.msg)

            if (result.data.code == 'L001') {
              
              this.register();
              setTimeout(() => {
                this.goHome('Login');
              }, 800)
            }

          }).catch(err => {
            this.$toast.clear();
            
          })        

        }
    },

    // 跳转
    goHome(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  /deep/ .van-button--primary {
    background-color: #bd7833;
    border-color: #bd7833;
  }
  /deep/ .box-title {
    margin-top: -40px;
  }
}
</style>