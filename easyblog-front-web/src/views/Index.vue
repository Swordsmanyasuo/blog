<template>
  <div class="home-body">
    <div class="container">
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
              <router-link :to="'blog/' + item.blogId">{{
              item.title
            }}</router-link>
            </div>
            <div class="blog-summary">{{ item.summary }}</div>
            <div class="blog-info">
              <div class="create-time">{{ item.createTime }}</div>
              <div class="nick-name">
                作者：<router-link :to="'user#'+item.userId">{{ item.nickName }}</router-link>
              </div>
              <div class="nick-name">
                分类专栏：
                <router-link :to="'category/'+item.categoryId"
                             v-if="item.categoryId">{{item.categoryName}}</router-link>
                <span v-else>全部</span>
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
        <router-link to="/category"
                     class="more">更多&gt;&gt;</router-link>
      </div>
      <!--博客分类-->
      <div v-for="(item, index) in categoryList">
        <router-link :to="'category/'+item.categoryId"
                     class="category-item">
          <span class="category-icon">
            <img :src="proxy.globalInfo.getImageUrl + item.cover"
                 v-if="item.cover" />
            <img src="@/assets/default_img.png"
                 v-else />
          </span>
          <span class="category-name"
                :title="item.categoryName">{{item.categoryName}}</span>
          <span class="blog-count">{{ item.blogCount }}篇</span>
        </router-link>
      </div>

      <!--博客成员-->
      <div class="right-title team-user-title">
        <span>博客成员</span>
        <router-link to="user"
                     class="more">更多&gt;&gt;</router-link>
      </div>
      <div v-for="item in userList">
        <router-link :to="'user#'+item.userId"
                     class="user-item">
          <span class="user-icon">
            <img :src="proxy.globalInfo.getImageUrl + item.avatar"
                 v-if="item.avatar" />
            <img src="@/assets/default_avatar.png"
                 v-else />
          </span>
          <span class="user-info">
            <span class="nick-name"
                  :title="item.nickName">{{
              item.nickName
            }}</span>
            <span class="profession"
                  :title="item.profession">{{
              item.profession
            }}</span>
          </span>
          <span class="blog-count"> {{ item.blogCount }} </span>
        </router-link>
      </div>
      <!--专题-->
      <div class="right-title special-title">
        <span>专题</span>
        <router-link to="special"
                     class="more">更多&gt;&gt;</router-link>
      </div>
      <div v-for="(item, index) in specialList">
        <router-link :to="'special/'+item.categoryId"
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
import { ref, getCurrentInstance } from "vue";

const { proxy } = getCurrentInstance();

const api = {
  loadBlogList: "/view/loadBlogList",
  loadCategory: "/view/loadCategory",
  loadUser: "/view/loadTeamUser",
  loacSpecial: "/view/loadSpecial",
};
//const blogList = ref([]);
const blogDataInfo = ref({});
const loadBlogList = async (pageNo) => {
  pageNo = pageNo == null ? 1 : pageNo;
  let result = await proxy.Request({
    url: api.loadBlogList,
    params: {
      pageSize: 15,
      pageNo,
    },
  });
  if (!result) {
    return;
  }
  blogDataInfo.value = result.data;
};
loadBlogList();

const pageChange4BlogList = (pageNo) => {
  loadBlogList(pageNo);
};

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

//博客成员
const userList = ref([]);
const loacUserList = async () => {
  let result = await proxy.Request({
    url: api.loadUser,
    params: {
      pageSize: 5,
    },
  });
  if (!result) {
    return;
  }
  userList.value = result.data;
};
loacUserList();

//专题
const specialList = ref([]);
const loacSpecialList = async () => {
  let result = await proxy.Request({
    url: api.loacSpecial,
    params: {
      pageNo: 1,
      pageSize: 5,
    },
  });
  if (!result) {
    return;
  }
  specialList.value = result.data.list;
};
loacSpecialList();
</script>

<style lang="scss">
.home-body {
  display: flex;
  .container {
    background: #fff;
    flex: 1;
    padding: 10px 20px;
  }
  .right {
    .team-user-title,
    .special-title {
      margin-top: 20px;
    }
    .user-item {
      display: flex;
      margin-top: 20px;
      align-items: center;
      .user-icon {
        width: 60px;
        height: 60px;
        background: #ddd;
        border-radius: 30px;
        display: flex;
        align-items: center;
        overflow: hidden;

        img {
          max-width: 100%;
        }
      }
      .user-info {
        display: inline-block;
        margin: 0px 5px 0px 10px;
        flex: 1;
        span {
          color: #0b1c2c;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          display: block;
        }

        .nick-name {
          font-weight: bold;
          font-size: 16px;
          color: #4f4f4f;
        }
        .profession {
          color: #999898;
          font-size: 13px;
          margin-top: 10px;
        }
      }

      .blog-count {
        width: 40px;
        color: #999898;
        text-align: right;
      }
    }
    .special-title {
      margin-top: 20px;
    }
  }
}
</style>
