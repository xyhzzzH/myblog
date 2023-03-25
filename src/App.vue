<template>
  <div>
    <el-config-provider :locale="locale">
      <router-view/>
    </el-config-provider>
    
  </div>
</template>

<script setup>
// 汉化操作
import { reactive } from '@vue/reactivity';
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
const locale = zhCn;
const config = reactive({
  max:1
})
</script>


<style scoped>
</style>
