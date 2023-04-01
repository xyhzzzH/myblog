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
        <el-button
          type="primary"
          style="margin-left: 10px"
          @click="showEdit('add')"
          >新增博客</el-button
        >
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
          <a
            href="javascript:void(0)"
            class="a-link"
            @click="showEdit('update,row')"
            >修改</a
          >
          <el-divider direction="vertical" />
          <a href="javascript:void(0)" class="a-link" @click="del(row)">删除</a>
          <el-divider direction="vertical" />
          <a href="javascript:void(0)" class="a-link" @click="del(row)">预览</a>
        </div>
      </template>
    </Table>
    <!-- 新增修改弹窗 -->
    <Window
      :show="windowConfig.show"
      :buttons="windowConfig.buttons"
      @close="closeWindow"
    >
      <el-form :model="editForm" :rules="rules" ref="editFormRef">
        <el-form-item prop="title">
          <div class="title-input">
            <el-input
              placeholder="请输入博客标题"
              v-model="editForm.title"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="content">
          <EditorMarkdown
            :height="editorHeight"
            v-model="editForm.markdownContent"
            @htmlContent="setHtmlContent"
          ></EditorMarkdown>
        </el-form-item>
      </el-form>
      <!-- <EditorHtml :height="editorHtml"></EditorHtml> -->
    </Window>
  </div>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="800px"
    @close="dialogConfig.show = false"
  >
    <el-form
      :model="settingForm"
      :rules="rules"
      ref="settingFormRef"
      label-width="80px"
    >
      <el-form-item label="博客分类" prop="categoryId">
        <el-select
          style="width: 100%"
          v-model="settingForm.categoryId"
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
      <el-form-item label="封面" prop="cover">
        <CoverUpload v-model="settingForm.cover"></CoverUpload>
      </el-form-item>
      <el-form-item label="博客类型" prop="type">
        <el-radio-group v-model="settingForm.type">
          <el-radio :label="0">原创</el-radio>
          <el-radio :label="1">转载</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="原文地址"
        prop="reprintUrl"
        v-if="settingForm.type == 0"
      >
        <el-input placeholder="请输入原文地址" v-model="settingForm.reprintUrl">
        </el-input>
      </el-form-item>
      <el-form-item label="评论" prop="allowComment">
        <el-radio-group v-model="settingForm.allowComment">
          <el-radio :label="1">允许</el-radio>
          <el-radio :label="0">不允许</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="博客摘要" prop="summary">
        <el-input
          type="textarea"
          placeholder="请输入摘要"
          v-model="settingForm.summary"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="博客标签" prop="tag">
        <el-tag
          v-for="tag in blogTags"
          :key="tag"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          v-if="inputVisible"
          ref="InputRef"
          v-model="inputValue"
          class="tag-input"
          size="small"
          @keyup.enter="handleInputConfirm"
          @blur="handleInputConfirm"
        />
        <el-button v-else size="small" @click="showInput">
          + New Tag
        </el-button>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { getCurrentInstance, reactive, ref, nextTick } from "vue";
const api = {
  loadCategory: "/category/loadAllCategory4Blog",
  loadBlog: "/blog/loadBlog",
  saveBlog: "/blog/saveBlog",
};
const { proxy } = getCurrentInstance();
const queryFormData = reactive({});
const categoryList = ref([]);
const blogList = ref([]);
const editorHeight = window.innerHeight - 240;
const editorHtml = window.innerHeight - 300;
const editForm = ref({});
const editRules = {};
const settingForm = ref({});
const rules = {
  title: [{ required: true, message: "请输入标题" }],
  content: [{ required: true, message: "请输入内容" }],
  categoryId: [{ required: true, message: "请选择博客分类" }],
  type: [{ required: true, message: "请选择博客类型" }],
  allowComment: [{ required: true, message: "请选择是否允许评论" }],
  reprintUrl: [{ required: true, message: "请输入原文地址" }],
  summary: [{ required: true, message: "请输入博客摘要" }],
};
// markdown编辑设置html内容
const setHtmlContent = (htmlContent) => {
  editForm.value.content = htmlContent;
  console.log(htmlContent);
};
const submitBlog = () => {
  settingFormRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = {};
    Object.assign(params, settingForm.value);
    Object.assign(params, editForm.value);
    params.editorType = 1;
    let res = await proxy.Request({
      url: api.saveBlog,
      params: params,
    });
    proxy.Message.success("保存博客成功");
  });
};
// 博客设置
const dialogConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: submitBlog,
    },
  ],
});
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
const editFormRef = ref();
const windowConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        showSettings();
      },
    },
  ],
});

// 展示博客设置
const showSettings = () => {
  editFormRef.value.validate((valid) => {
    if (!valid) {
      console.log(editForm.value);
      return;
    }
    dialogConfig.show = true;
  });
};
const closeWindow = () => {
  windowConfig.show = false;
  loadBlogList();
};

const showEdit = (type, data) => {
  windowConfig.show = true;
};
// 输入框
const inputValue = ref("");
// 标签数组
const blogTags = ref([]);
// 输入框可视
const inputVisible = ref(false);
const InputRef = ref();
const settingFormRef = ref();

const handleClose = (tag) => {
  blogTags.value.splice(blogTags.value.indexOf(tag), 1);
};
const showInput = () => {
  inputVisible.value = true;
  nextTick(() => {
    InputRef.value.focus();
  });
};

const handleInputConfirm = () => {
  if (inputValue.value) {
    blogTags.value.push(inputValue.value);
  }
  inputVisible.value = false;
  inputValue.value = "";
};
</script>

<style lang="scss">
.is-error .title-input .el-input__wrapper {
  box-shadow: none;
}
.title-input {
  width: 100%;
  border-bottom: 1px solid #ddd;
  .el-input__wrapper {
    box-shadow: none;
  }
  input {
    font-size: 20px;
  }
}
.tag-input {
  width: 80px;
}
</style>