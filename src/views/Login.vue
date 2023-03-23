<template>
  <div class="login-body">
    <div class="login-form">
      <div class="login-title">用户登录</div>
      <el-form ref="loginForm" :model="loginForm">
        <el-form-item>
          <el-input
            v-model="loginForm.userName"
            placeholder="请输入用户名 "
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <div class="checkCode-item">
            <el-input
              v-model="loginForm.checkcode"
              placeholder="请输入验证码"
            ></el-input>
            <img :src="checkCodeUrl" class="item-img" style="cursor:pointer"  @click="changeCheckCode"/>
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="loginForm.remenberMe">记住我</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
const loginForm = reactive({});
const checkCodeUrl = ref("api/checkCode?" + new Date().getTime());
const changeCheckCode = ()=>{
  checkCodeUrl.value = "api/checkCode?"+ new Date().getTime();
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
    .checkCode-item{
      display: flex;
      .item-img{
        margin-left: 6px;
      }
    }
  }
}
</style>