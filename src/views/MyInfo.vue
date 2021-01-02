<template>
  <div class="my">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      fixed
      @click-left="back"
    />
    <div class="order-bg"></div>
    <div class="my-box">
      <div class="my-img">
        <van-cell title="头像" :center="true">
          <div class="img-box fr">
            <img class="auto-img" :src="userInfo.userImg || userInfo.user_img" />
            <van-uploader class="upload-box" :after-read="afterRead" />
          </div>
        </van-cell>

        <van-cell title="用户Id" :value="userInfo.userId" />

        <van-cell title="手机号" :value="userInfo.phone" />

        <van-cell title="昵称" :center="true">
          <van-cell-group>
            <van-field
              class="ipt-name"
              v-model="userInfo.nickName"
              placeholder="请输入昵称"
              input-align="right"
              maxlength="16"
              @change="setName"
            />
          </van-cell-group>
        </van-cell>

        <div class="intro">
          <div class="intro-title">简介</div>
          <div class="intro-content">
            <van-cell-group>
              <van-field
                class="ipt"
                v-model="userInfo.desc"
                placeholder="请输入简介"
                input-align="left"
                maxlength="20"
                @change="setDesc"
              />
            </van-cell-group>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/myinfo.less";
export default {
  name: "MyInfo",
  data() {
    return {
      userInfo: {
        nickName: "",
        userImg: "",
        userId: "",
        phone: "",
        desc: "",
      },
    };
  },
  created() {
    this.getMyInfo();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

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

        url: "/findAccountInfo",
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
          } else if (result.data.code == "B001") {
            if (result.data.result[0].desc == "") {
              result.data.result[0].desc = "这个人很懒，什么也没留下";
            }

            this.userInfo = result.data.result[0];
          }
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

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

        url: "/updateAvatar",
        // 参数
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: fileType,
          serverBase64Img: base64,
        },
      })
        .then((result) => {
          // 
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

    // 修改昵称
    setName() {
      if (!this.userInfo.nickName) {
        // 
        this.$toast("昵称不能为空");
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

        url: "/updateNickName",
        // 参数
        data: {
          appkey: this.appkey,
          tokenString,
          nickName: this.userInfo.nickName,
        },
      })
        .then((result) => {
          // 
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else {
            this.$toast("修改昵称成功");
          }
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },

    // 修改简介
    setDesc() {
      if (!this.userInfo.desc) {
        this.userInfo.desc = "这个人很懒，什么也没留下";
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

        url: "/updateDesc",
        // 参数
        data: {
          appkey: this.appkey,
          tokenString,
          desc: this.userInfo.desc,
        },
      })
        .then((result) => {
          // 
          this.$toast.clear();

          if (result.data.code == 700) {
            // 登录失效，token校验不成功
            this.$router.push({ name: "Login" });
          } else {
            this.$toast(result.data.msg);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          // 
        });
    },
  },
};
</script>

<style lang="less" scoped>
</style>