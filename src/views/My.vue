<template>
  <div class="my">
    <!-- 背景 -->
    <div class="my-top">
      <div
        class="my-bg"
        :style="{ backgroundImage: `url('${userInfo.userBg}')` }"
        v-if="tokenString.length == 0"
      >
        <van-uploader class="upload-box" :after-read="afterRead" />
      </div>
      <div class="my-bg" v-else>
        <img class="auto-img" src="../assets/images/my.png" alt="" />
      </div>
    </div>
    <div class="my-box">
      <!-- 登录状态 -->
      <div class="my-user">
        <div class="my-info clear" v-if="tokenString.length == 0">
          <!-- 头像 -->
          <div class="my-img fl">
            <img class="auto-img" :src="userInfo.userImg" alt="" />
          </div>
          <div class="my-title fl">
            <div class="my-name">{{ userInfo.nickName }}</div>
            <div class="my-desc">
              {{
                userInfo.desc == "" ? "这个人很懒，什么也没留下" : userInfo.desc
              }}
            </div>
          </div>
        </div>

        <!-- 没登录状态 -->
        <div class="my-info clear" v-else>
          <div class="my-img fl">
            <img class="auto-img" src="#" alt="" />
          </div>
          <div class="my-title fl">
            <div class="login" @click="goLogin">
              <span>登录/注册</span>
            </div>
          </div>
        </div>

        <div class="info-box">
          <div class="info-list">
            <van-cell
              :title="item.title"
              is-link
              v-for="(item, index) in myInfoData"
              :key="index"
              @click="goDatalist(item.name)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "My",

  data() {
    return {
      // 登录字符串
      tokenString: "",

      // 个人信息数据
      userInfo: {},

      // 我的页面渲染数据
      myInfoData: [
        {
          title: "个人资料",
          name: "MyInfo",
        },
        {
          title: "我的订单",
          name: "Order",
        },
        {
          title: "我的收藏",
          name: "Link",
        },
        {
          title: "收货地址",
          name: "Addresslist",
        },
        {
          title: "安全中心",
          name: "Safe",
        },
      ],
    };
  },

  created() {
    // this.tokenString = localStorage.getItem("__log");

    // 获取我的账号
    this.getMyInfo();
  },

  methods: {
    // 获取是否登录状态

    // 获取我的账号信息
    getMyInfo() {
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

        url: "/findMy",
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
          } else if (result.data.code == "A001") {
            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 跳转到登录注册
    goLogin() {
      this.$router.push({ name: "Login" });
    },

    // 上传文件
    afterRead(file) {
      //
      // 文件支持的类型
      let type = ["gif", "png", "jpg", "jpeg"];

      // 最大文件大小 1MB
      let size = 1;

      // 判断文件类型
      let fileType = file.file.type.split("/");
      if (type.indexOf(fileType) === -1) {
        this.$toast(`文件类型只支持${type.join(",")}`);
      }

      // 判断文件大小
      let fileSize = file.file.size / 1024 / 1024;
      if (fileSize > size) {
        this.$toast(`文件大小不能超过${size}MB`);
        return;
      }

      // 处理base64的标记
      let base64 = file.content.replace(/^data.image\/[A-Za-z]+;base64,/, "");

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

        url: "/updateUserBg",
        // 参数
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else if (result.data.code == "I001") {
            this.userInfo.userBg = result.data.userBg;
          }
          this.$toast(result.data.msg);
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    // 跳转
    goDatalist(name) {
      this.$router.push({ name });
    },
  },
};
</script>

<style lang="less" scoped>
.my {
  .my-top {
    width: 100%;
    // height: 160px;
    background-color: #ddd;
  }
  .my-bg {
    height: 180px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    .upload-box {
      opacity: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      /deep/ .van-uploader__upload {
        width: 100%;
        margin: 0;
      }
      /deep/ .van-uploader__input {
        height: 180px;
      }
    }
  }

  .my-box {
    position: absolute;
    top: 140px;
    margin: 0 10px;
    width: calc(~"100% - 20px");
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background-color: white;
  }
  .my-img {
    width: 80px;
    border-radius: 50%;
    overflow: hidden;
    margin: 10px 20px;
  }
  .my-name {
    font-size: 16px;
    margin: 20px 0 10px;
    color: #bd7833;
    font-weight: bold;
  }
  .my-desc {
    font-size: 14px;
    color: #999;
    height: 40px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .info-box {
    margin-top: 50px;
  }
  .login {
    margin-top: 30px;
    margin-left: -20px;
    font-size: 16px;
    width: 120px;
    height: 30px;
    border: 1px solid black;
    text-align: center;
    line-height: 30px;
  }
  /deep/ .van-cell {
    padding: 12px 20px;
    line-height: 26px;
    &:active {
      background-color: transparent;
    }
  }
  /deep/ .van-cell__right-icon {
    line-height: 26px;
  }
}
</style>