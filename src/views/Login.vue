<template>
  <div class="login-body">
    <div class="login-form">
      <div class="login-title">用户登录</div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="rules">
        <el-form-item prop="userName">
          <el-input size="large" v-model="loginForm.userName" placeholder="请输入用户名 ">
            <template #prefix>
              <span class="iconfont icon-ACCOUNT"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="large" type="password" v-model="loginForm.password" placeholder="请输入密码">
            <template #prefix>
              <span class="iconfont icon-Password"></span>
            </template></el-input>
        </el-form-item>
        <el-form-item prop="checkcode">
          <div class="checkCode-item">
            <el-input size="large" v-model="loginForm.checkCode" placeholder="请输入验证码"></el-input>
            <img :src="checkCodeUrl" class="item-img" style="cursor:pointer" @click="changeCheckCode" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remenberMe">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue";
import md5 from 'js-md5'
const {proxy} = getCurrentInstance();
const api = {
  checkCode: 'api/checkCode',
  login: 'login'
}
const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + '?' + new Date().getTime();
}

// 表单相关
const loginFormRef = ref();
const loginForm = reactive({

});
const rules = {
  userName: [{
    required: true,
    message: '请输入用户名',
  }],
  password: [{
    required: true,
    message: '请输入密码',
  }],
  checkCode: [{
    required: true,
    message: '请输入验证码',
  }]
}

const login = () => {
  loginFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.login,
      params: {
        account: loginForm.userName,
        password: md5(loginForm.password),
        checkCode: loginForm.checkCode
      },errorCallback(){
        changeCheckCode();
      }
    })
    if (result) {
      return;
    }
  })

}
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