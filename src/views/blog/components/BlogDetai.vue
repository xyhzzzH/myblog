<template>
  <div>
    <Window
      :show="windowConfig.show"
      :showCancel="false"
      @close="windowConfig.show = false"
    >
      <div class="detail-title">{{ blog.title }}</div>
      <div class="detail-content" v-html="blog.content"></div>
    </Window>
  </div>
</template>

<script setup>
import { getCurrentInstance, nextTick, reactive, ref } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; //样式
const { proxy } = getCurrentInstance();
const api = {
  getBlogDetail: "/blog/getBlogById",
};
const windowConfig = reactive({
  show: false,
});
const blog = ref({});
const contentRef = ref(null);

const showDetail = async (blogId) => {
  windowConfig.show = true;
  let res = await proxy.Request({
    url: api.getBlogDetail,
    params: {
      blogId: blogId,
    },
  });
  if (!res) {
    return;
  }
  blog.value = res.data;
  nextTick(() => {
    highlight(contentRef);
  });
};
const highlight = () => {
  let blocks = document.querySelectorAll("pre code");
  blocks.forEach((block) => {
    hljs.highlightBlock(block);
  });
};
defineExpose({ showDetail, windowConfig });
</script>
<style lang="scss">
.detail-title {
  font-size: 25px;
  border-bottom: 2px solid #f0f0f0;
}
.detail-content{
    img {
        max-width: 80%;
    }
}
</style>