<template>
  <div class="layout">
    <el-container>
      <el-header class="header">
        <div class="logo">宇的blog</div>
        <div class="userInfo">
          <span>欢迎回来，</span>
          <el-dropdown>
            <span class="user-menu">
              <span>
                {{ userInfo.nickName }}
              </span>
              <span class="iconfont icon-open"></span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/settings/my">个人信息</router-link>
                </el-dropdown-item>
                <el-dropdown-item @click="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar"><img :src="userInfo.avatar" /></div>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside width="200px" class="left-aside">
          <div>
            <el-button type="primary" style="width: 100%">发布</el-button>
            <div class="left-menu">
              <ul>
                <li v-for="(menu, i) in menuList" :key="i">
                  <span class="menu-title-p" @click="openClose(i)">
                    <span :class="['iconfont', menu.icon]"></span>
                    <span class="menu-title">{{ menu.title }}</span>
                    <span :class="[
                      'iconfont',
                      'open-close',
                      menu.open ? 'icon-close' : 'icon-open',
                    ]"></span>
                  </span>
                  <ul class="sub-menu" v-show="menu.open">
                    <li v-for="(item, i) in menu.children" :key="i">
                      <router-link :to="item.path" :class="[
                        'sub-menu-item',
                        activePath === item.path ? 'selected-menu' : '',
                      ]">{{ item.title }}</router-link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </el-aside>
        <el-main class="right-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref, watch } from "vue";
import VueCookies from "vue-cookies";
import { useRouter, useRoute } from "vue-router";
import { useStore } from 'vuex'
const store = useStore()

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  getUserInfo: 'getUserInfo',
  logout: 'logout'
}
const openClose = (index) => {
  const open = menuList.value[index].open;
  menuList.value[index].open = !open;
};
const logout = () => {
  proxy.Confirm(`你确定要退出吗`, async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    router.push('/login')
  });
}
const menuList = ref([
  {
    title: "博客",
    icon: "icon-blog",
    open: true,
    children: [
      {
        title: "博客管理",
        path: "/blog/list",
      },
      {
        title: "分类管理",
        path: "/blog/category",
      },
    ],
  },
  {
    title: "专题",
    icon: "icon-zhuantifuwu",
    open: true,
    children: [
      {
        title: "专题管理",
        path: "/special/list",
      },
    ],
  },
  {
    title: "设置",
    icon: "icon-settings",
    open: true,
    children: [
      {
        title: "个人信息设置",
        path: "/settings/my",
      },
      {
        title: "博客成员",
        path: "/settings/user",
      },
      {
        title: "系统设置",
        path: "/settings/sysSetting",
      },
    ],
  },
  {
    title: "回收站",
    icon: "icon-delete",
    open: true,
    children: [
      {
        title: "回收站",
        path: "/recovery/list",
      },
    ],
  },
]);
const userInfo = ref({});
const getUserInfo = async () => {
  let res = await proxy.Request({
    url: api.getUserInfo
  })
  if (!res) {
    return
  }
  userInfo.value = res.data;
  userInfo.value.avatar = proxy.globalInfo.imageUrl + res.data.avatar;
};
getUserInfo();
const activePath = ref(null);
watch(() => store.state.userInfo, (newValue, oldValue) => {
  const avatar = proxy.globalInfo.imageUrl + newValue.avatar;
  const nickName = newValue.nickName;
  userInfo.value = { avatar, nickName }

}, { immediate: true, deep: true })
watch(
  route,
  (newValue) => {
    activePath.value = newValue.path;
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.layout {
  .header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
    justify-content: space-between;

    .logo {
      font-size: 30px;
    }

    .userInfo {
      display: flex;
      align-items: center;
      font-size: 20px;

      .user-menu {
        cursor: pointer;
        color: var(--el-color-primary);

        .icon-open {
          font-size: 14px;
        }
      }

      .avatar {
        width: 50px;
        height: 50px;
        margin-left: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f0f0f0;
        border-radius: 25px;

        img {

          border-radius: 25px;
          width: 100%;
          object-fit: contain;

        }
      }
    }
  }

  .container {
    background-color: #f5f6f7;
    height: calc(100vh - 60px);

    .left-aside {
      padding: 15px;
      width: 250px;

      .left-menu {
        .menu-title-p {
          line-height: 40px;
          cursor: pointer;
          display: flex;

          .open-close {
            width: 20px;
          }

          .iconfont {
            color: #409eff;
            font-size: 16px;
          }

          .menu-title {
            font-size: 18px;
            flex: 1;
            margin-left: 5px;
          }
        }

        .sub-menu {
          margin-left: 25px;
          font-size: 16px;

          .sub-menu-item {
            display: block;
            padding: 0px 20px;
            line-height: 30px;
            cursor: pointer;
            border-radius: 5px;
            text-decoration: none;
          }

          .selected-menu {
            color: #409eff;
            background-color: #ecf5ff;
            font-weight: 600;
          }

          .sub-menu-item:hover {
            color: #409eff;
          }
        }

        ul,
        li {
          padding: 0px;
          margin: 0px;
          list-style: none;
        }
      }
    }

    .right-main {
      position: relative;
      background-color: #fff;
    }
  }
}
</style>