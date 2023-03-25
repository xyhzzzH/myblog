<template>
  <div class="login-body">
    <div class="login-form">
      <div class="login-title">用户登录</div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules">
        <el-form-item prop="account">
          <el-input
            size="large"
            v-model="loginForm.account"
            placeholder="请输入用户名 "
          >
            <template #prefix>
              <span class="iconfont icon-ACCOUNT"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            size="large"
            type="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
          >
            <template #prefix>
              <span class="iconfont icon-Password"></span> </template
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkcode">
          <div class="checkCode-item">
            <el-input
              size="large"
              v-model="loginForm.checkCode"
              placeholder="请输入验证码"
              @keyup.enter="login"
            ></el-input>
            <img
              :src="checkCodeUrl"
              class="item-img"
              style="cursor: pointer"
              @click="changeCheckCode"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remenberMe">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import VueCookies from "vue-cookies";
import { getCurrentInstance, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import md5 from "js-md5";
const router = useRouter();
const { proxy } = getCurrentInstance();
const api = {
  checkCode: "api/checkCode",
  login: "login",
};
const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
};

// 表单相关
const loginFormRef = ref();
const loginForm = reactive({});
const rules = {
  account: [
    {
      required: true,
      message: "请输入用户名",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
  checkCode: [
    {
      required: true,
      message: "请输入验证码",
    },
  ],
};
const init = () => {
  const loginInfo = VueCookies.get("loginInfo");
  if (!loginInfo) {
    return;
  }
  Object.assign(loginForm, loginInfo);
};
init();
const login = () => {
  loginFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let cookieLoginInfo = VueCookies.get("loginInfo");
    let cookiePassword =
      cookieLoginInfo == null ? null : cookieLoginInfo.password;
    let params = {
      account: loginForm.account,
      password: loginForm.password,
      checkCode: loginForm.checkCode,
    };
    // 密码如果没有md5 就md5加密
    if (params.password !== cookiePassword) {
      params.password = md5(params.password);
    }
    let result = await proxy.Request({
      url: api.login,
      params: params,
      errorCallback() {
        changeCheckCode();
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("登录成功");
    setTimeout(() => {
      router.push('/')
    }, 1000);
    const loginInfo = {
      account: params.account,
      password: params.password,
      remenberMe: loginForm.remenberMe,
    };
    VueCookies.set("userInfo", result.data, 0);
    if (loginForm.remenberMe) {
      VueCookies.set("loginInfo", loginInfo, "7d");
    } else {
      VueCookies.remove("loginInfo");
    }
  });
};
</script>

<style lang="scss">
.login-body {
  width: 100%;
  height: calc(100vh);
  background-image: url(../assets/login.jpg);
  background-size: 100% auto;

  .login-form {
    float: right;
    width: 400px;
    margin-right: 100px;
    margin-top: 200px;
    border-radius: 5px;
    padding: 20px;
    box-shadow: 2px 2px 10px #ddd;
    background-color: rgba($color: #fff, $alpha: 0.6);

    .login-title {
      font-size: 20px;
      text-align: center;
      margin-bottom: 20px;
    }

    .checkCode-item {
      display: flex;

      .item-img {
        margin-left: 7px;
      }
    }
  }
}
</style>