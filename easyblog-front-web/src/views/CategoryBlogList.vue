<template>
  <div class="category-body">
    <div class="container">
      <div class="category-panel">
        <div class="category-image">
          <img :src="proxy.globalInfo.getImageUrl + categoryInfo.cover"
               v-if="categoryInfo.cover" />
          <img src="@/assets/default_img.png"
               v-else />
        </div>
        <div class="category-info">
          <div class="category-title">{{categoryInfo.categoryName}}</div>
          <div class="category-desc">{{categoryInfo.categoryDesc}}</div>
          <div class="blog-count">文章数：{{categoryInfo.blogCount}}</div>
        </div>
      </div>
      <div class="blog-list">
        <div class="blog-item"
             v-for="(item, index) in blogDataInfo.list">
          <div class="blog-cover">
            <img :src="proxy.globalInfo.getImageUrl + item.cover"
                 v-if="item.cover" />
            <img src="@/assets/default_img.png"
                 v-else />
          </div>
          <div class="blog-item-content">
            <div class="title">
              <router-link :to="'../blog/' + item.blogId">{{
              item.title
            }}</router-link>
            </div>
            <div class="blog-summary">{{ item.summary }}</div>
            <div class="blog-info">
              <div class="create-time">{{ item.createTime }}</div>
              <div class="nick-name">
                作者：<router-link :to="'../user#'+item.userId">{{ item.nickName }}</router-link>
              </div>
              <div class="nick-name">
                分类专栏：{{item.categoryName}}
              </div>
            </div>
          </div>
        </div>
        <Pagination :total="blogDataInfo.totalCount"
                    :pageSize="blogDataInfo.pageSize"
                    :pageNo="blogDataInfo.pageNo"
                    @pageChange="pageChange4BlogList"></Pagination>
      </div>
    </div>
    <div class="right">
      <div class="right-title">
        <span>分类专栏</span>
        <router-link to="../category"
                     class="more">更多&gt;&gt;</router-link>
      </div>
      <!--博客分类-->
      <div v-for="(item, index) in categoryList">
        <router-link :to="'../category/'+item.categoryId"
                     class="category-item">
          <span class="category-icon">
            <img :src="proxy.globalInfo.getImageUrl + item.cover"
                 v-if="item.cover" />
            <img src="@/assets/default_img.png"
                 v-else />
          </span>
          <span class="category-name"
                title="EasyBlog">{{
            item.categoryName
          }}</span>
          <span class="blog-count">{{ item.blogCount }}篇</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import "@/assets/scss/blog.list.scss"
import "@/assets/scss/category.scss"
import { ref, getCurrentInstance, watch } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const { proxy } = getCurrentInstance();

const api = {
  loadBlogList: "/view/loadBlogList",
  loadCategory: "/view/loadCategory",
  getCategory: "view/getCategory"
};
const categoryId = ref();

const blogDataInfo = ref({});
const loadBlogList = async (pageNo) => {
  pageNo = pageNo == null ? 1 : pageNo;
  let result = await proxy.Request({
    url: api.loadBlogList,
    params: {
      categoryId: categoryId.value,
      pageSize: 15,
      pageNo,
    },
  });
  if (!result) {
    return;
  }
  blogDataInfo.value = result.data;
};

//分页
const pageChange4BlogList = (pageNo) => {
  loadBlogList(pageNo);
};

//获取分类详情
const categoryInfo = ref({});
const categoryDetail = async () => {
  let result = await proxy.Request({
    url: api.getCategory,
    params: {
      categoryId: categoryId.value
    }
  })
  if (!result) {
    return;
  }
  categoryInfo.value = result.data;
}

//分类
const categoryList = ref([]);
const loacCategoryList = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
    params: {
      pageSize: 5,
    },
  });
  if (!result) {
    return;
  }
  categoryList.value = result.data;
};
loacCategoryList();

watch(() => route.params.categoryId, (newVal, oldVal) => {
  if (!newVal) {
    return;
  }
  categoryId.value = newVal;
  loadBlogList();
  categoryDetail();
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped>
.category-body {
  display: flex;
  .container {
    flex: 1;
    .category-panel {
      background: #fff;
      display: flex;
      padding: 10px 20px;
      .category-image {
        width: 100px;
        height: 100px;
        background: #ddd;
        border-radius: 4px;
        display: flex;
        align-items: center;
        img {
          border-radius: 2px;
          max-width: 100%;
        }
      }
      .category-info {
        flex: 1;
        margin-left: 10px;
        .category-title {
          font-size: 20px;
          font-weight: bold;
        }
        .category-desc {
          margin-top: 10px;
        }
        .blog-count {
          margin-top: 10px;
          color: #919da9;
        }
      }
    }
    .blog-list {
      margin-top: 10px;
      background: #fff;
      padding: 10px 20px;
    }
  }
}
</style>
