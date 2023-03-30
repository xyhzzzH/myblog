<template>
  <div class="top-panel">
    <el-form :model="queryFormData" label-width="80px">
      <el-row>
        <el-col :span="4">
          <el-form-item label="标题" prop="titleFuzzy">
            <el-input
              style="width: 214px"
              placeholder="请输入名称"
              v-model="queryFormData.titleFuzzy"
              clearable
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryFormData.status"
              clearable
              placeholder="请选择状态"
            >
              <el-option :value="0" label="草稿"></el-option>
              <el-option :value="1" label="已发布"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="分类" prop="categoryId">
            <el-select
              v-model="queryFormData.categoryId"
              clearable
              placeholder="请选择分类"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.categoryId"
                :value="item.categoryId"
                :label="item.categoryName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button type="danger" @click="loadBlogList">搜索</el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-button type="primary" style="margin-left: 10px" @click="showEdit('add')">新增博客</el-button>
      </el-row>
    </el-form>
  </div>
  <div class="table-body">
    <Table
      :columns="columns"
      :showPagination="true"
      :dataSource="blogList"
      :fetch="loadBlogList"
      :options="tableOptions"
    >
      <template #cover="{ row }">
        <Cover :cover="row.cover"></Cover>
      </template>
      <template #blogInfo="{ row }">
        <div>标题：{{ row.title }}</div>
        <div>分类：{{ row.categoryName }}</div>
        <div>作者：{{ row.nickName }}</div>
      </template>
      <template #typeName="{ row }">
        <div>{{ row.type == 0 ? "原创" : "转载" }}</div>
        <div v-if="row.type == 1">转载地址：{{ row.reprintUrl }}</div>
      </template>
      <template #statusName="{ row }">
        <el-tag v-if="row.status == 0" size="large">{{
          row.statusName
        }}</el-tag>
        <el-tag v-else type="warning" size="large">{{ row.statusName }}</el-tag>
      </template>
      <template #Time="{ row }">
        <div>创建时间：{{ row.createTime }}</div>
        <div>更新时间：{{ row.lastUpdateTime }}</div>
      </template>
      <template #op="{ row }">
        <div class="op">
          <a href="javascript:void(0)" class="a-link" @click="showEdit('update,row')">修改</a>
          <el-divider direction="vertical" />
          <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
          <el-divider direction="vertical" />
          <a href="javascript:void(0)" class="a-link" @click="del(row)">预览</a>
        </div>
      </template>
    </Table>
    <!-- 新增修改弹窗 -->
    <Window :show="windowConfig.show" :button="windowConfig.buttons" @close="closeWindow"></Window>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue";
const api = {
  loadCategory: "/category/loadAllCategory4Blog",
  loadBlog: "/blog/loadBlog",
};
const { proxy } = getCurrentInstance();
const queryFormData = reactive({});
const categoryList = ref([]);
const blogList = ref([]);
const loadCategoryList = async () => {
  let res = await proxy.Request({
    url: api.loadCategory,
  });
  categoryList.value = res.data;
};
const loadBlogList = async () => {
  let params = {
    pageNo: blogList.pageNo,
    pageSize: blogList.pageSize,
  };
  Object.assign(params, queryFormData);
  let res = await proxy.Request({
    url: api.loadBlog,
    params,
  });
  blogList.value = res.data;
};
loadBlogList();
loadCategoryList();
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "文章信息",
    prop: "blogInfo",
    width: 200,
    scopedSlots: "blogInfo",
  },
  {
    label: "编辑器",
    prop: "editorTypeName",
    width: 200,
  },
  {
    label: "类型",
    prop: "typeName",
    width: 200,
    scopedSlots: "typeName",
  },
  {
    label: "评论",
    prop: "allowCommentTypeName",
    width: 200,
  },
  {
    label: "状态",
    prop: "statusName",
    width: 200,
    scopedSlots: "statusName",
  },
  {
    label: "时间",
    prop: "Time",
    width: 300,
    scopedSlots: "Time",
  },
  {
    label: "操作",
    prop: "op",
    width: 150,
    scopedSlots: "op",
  },
];
const tableData = reactive({});
const tableOptions = {
  extHeight: 100,
};

const windowConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click:(e)=>{
        console.log(e);
      }
    }
  ],
});

const closeWindow = ()=>{
  windowConfig.show = false;
  loadBlogList();
}

const showEdit = (type,data)=>{
  windowConfig.show = true;
}
</script>

<style lang="scss">
</style>