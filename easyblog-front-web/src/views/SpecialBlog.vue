<template>
  <div class="blog-detail">
    <div class="blog-special-list">
      <div class="blog-special">
        <div class="category-image">
          <img :src="proxy.globalInfo.getImageUrl + blogCategory.cover"
               v-if="blogCategory.cover" />
          <img src="@/assets/default_img.png"
               v-else />
        </div>
        <div class="category-info">
          <div class="category-title"
               :title="blogCategory.categoryName">{{blogCategory.categoryName}}</div>
          <div class="blog-count">文章数：{{blogCategory.blogCount}}</div>
        </div>
      </div>
      <div class="category-desc"
           :title="blogCategory.categoryDesc">简介：{{blogCategory.categoryDesc}}</div>

      <div class="blog-list">
        <el-tree ref="refTree"
                 :data="blogTreeData"
                 defaultExpandAll
                 node-key="blogId"
                 :expand-on-click-node="false"
                 :props="treeProps"
                 :highlight-current="true"
                 @node-click="showDetail"
                 class="tree-panel">
        </el-tree>
      </div>

    </div>
    <div class="blog-detail-container">
      <div class="container-content">
        <div class="blog-title">{{blogInfo.title}}</div>
        <div class="blog-info">
          <div class="time">{{blogInfo.createTime}}</div>
          <div class="nick-name">作者：<router-link :to="'../user#'+blogInfo.userId">{{blogInfo.nickName}}</router-link>
          </div>
        </div>
        <div class="content"
             id="content"
             v-html="blogInfo.content"></div>
      </div>
      <!-- <div class="container-comment">
        <div class="comment-title">评论</div>
      </div> -->
    </div>
  </div>
</template>
<script setup>
import "@/assets/scss/blog.detail.scss"
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css"; //样式

import { getCurrentInstance, ref, nextTick, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const { proxy } = getCurrentInstance();
const api = {
  getBlogDetail: "view/getBlogDetail",
  loadCategory: "/view/loadCategory",
  getSpecialDetail: "/view/getSpecialDetail"
};
//属性展示专题
const treeProps = {
  children: "children",
  label: "title",
  value: "blogId",
};


const paramsId = ref(route.params.blogId)
const blogId = ref(null);
const categoryId = ref(null);

const isNumber = (val) => {
  const reg = /^[0-9]*$/;
  if (reg.test(val)) {
    return true;
  } else {
    return false;
  }
}

//获取博客专辑
const refTree = ref();
const blogTreeData = ref([]);
const blogCategory = ref({});
const loadBlogTreeData = async () => {
  let result = await proxy.Request({
    url: api.getSpecialDetail,
    params: {
      categoryId: categoryId.value
    }
  })
  if (!result) {
    return;
  }
  blogTreeData.value = result.data.blogList;
  blogCategory.value = result.data.blogCategory;
  if (blogId.value == null) {
    blogId.value = result.data.blogList[0].blogId;
    getBlogDetail(blogId);
  }
  nextTick(() => {
    refTree.value.setCurrentKey(blogId.value);
  })
}

//获取博客信息
const blogInfo = ref({});
const getBlogDetail = async () => {
  let result = await proxy.Request({
    url: api.getBlogDetail,
    params: {
      blogId: blogId.value
    },
  });
  if (!result) {
    return;
  }
  if (categoryId.value == null) {
    categoryId.value = result.data.categoryId;
    loadBlogTreeData();
  }
  blogInfo.value = result.data;
  highlightCode();
};

//点击树
const showDetail = (data) => {
  router.push("/special/" + data.blogId);
};

//高亮代码显示
const highlightCode = () => {
  nextTick(() => {
    //高亮显示
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((block) => {
      hljs.highlightBlock(block);
    });
  });
}

watch(() => route.params.blogId, (newVal, oldVal) => {
  if (!newVal) {
    return;
  }
  if (isNumber(newVal)) {
    categoryId.value = newVal;
    loadBlogTreeData();
  } else {
    blogId.value = newVal;
    getBlogDetail();
  }
}, { immediate: true, deep: true })

</script>

<style lang="scss" scoped>
.blog-detail {
  display: flex;
  .blog-special-list {
    width: 300px;
    min-height: calc(100vh - 160px);
    border-right: 1px solid #ddd;
    background: #fff;
    box-sizing: border-box;
    .blog-special {
      display: flex;
      padding: 10px 0px 0px 10px;
      .category-image {
        width: 50px;
        height: 50px;
        background: #ddd;
        border-radius: 4px;
        display: flex;
        align-items: center;
        float: left;
        img {
          border-radius: 2px;
          max-width: 100%;
        }
      }
      .category-info {
        margin-left: 5px;
        flex: 1;
        font-size: 14px;
        .category-title {
          max-width: 100%;
          font-size: 15px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
        }
        .blog-count {
          font-size: 13px;
          margin-top: 5px;
          color: #919da9;
        }
      }
    }
    .category-desc {
      padding-left: 10px;
      font-size: 13px;
      color: #3d3d3d;
      max-width: 100%;
      margin-top: 10px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
      padding-bottom: 10px;
    }
    .blog-list {
      border-top: 1px solid #ddd;
      padding: 10px 1px 0px 1px;
    }
  }
  .container {
    flex: 1;
    .container-content {
      background: #fff;
      padding: 10px 20px;
    }
    .container-comment {
      margin-top: 20px;
      background: #fff;
      padding: 10px;
    }
  }
}
</style>
