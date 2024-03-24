<template>
  <div>
    <div class="blog-detail">
      <div class="blog-detail-container">
        <div class="container-content">
          <div class="blog-title">{{ blogInfo.title }}</div>
          <div class="blog-info">
            <div class="time">{{ blogInfo.createTime }}</div>
            <div class="nick-name">
              作者：<router-link :to="'../user#' + blogInfo.userId">{{
                blogInfo.nickName
              }}</router-link>
            </div>
            <div class="category">
              分类专栏：
              <router-link
                :to="'../category/' + blogInfo.categoryId"
                v-if="blogInfo.categoryId"
                >{{ blogInfo.categoryName }}</router-link
              >
              <span v-else>全部</span>
            </div>
          </div>
          <div class="content" id="content" v-html="blogInfo.content"></div>
        </div>
        <!--  <div class="container-comment">
          <div class="comment-title">评论</div>
        </div> -->
      </div>
      <div class="right" id="right" :style="{ left: leftNum + 'px' }">
        <div
          class="container"
          id="right-container"
          :style="{ top: marginTop + 'px' }"
        >
          <div class="right-title toc-title">目录结构</div>
          <div class="toc-list">
            <template v-if="tocArray.length == 0">
              <div class="no-data">未解析到目录</div>
            </template>
            <template v-else>
              <div v-for="item in tocArray">
                <a
                  :href="'#' + item.id"
                  class="toc-item"
                  :style="{ 'padding-left': item.level * 15 + 'px' }"
                  >{{ item.title }}
                </a>
              </div>
            </template>
          </div>
          <div class="right-title category-title">
            <span>分类专栏</span>
            <router-link to="../category" class="more"
              >更多&gt;&gt;</router-link
            >
          </div>
          <div v-for="(item, index) in categoryList">
            <router-link
              :to="'../category/' + item.categoryId"
              class="category-item"
            >
              <span class="category-icon">
                <img
                  :src="proxy.globalInfo.getImageUrl + item.cover"
                  v-if="item.cover"
                />
                <img src="@/assets/default_img.png" v-else />
              </span>
              <span class="category-name" title="EasyBlog">{{
                item.categoryName
              }}</span>
              <span class="blog-count">{{ item.blogCount }}篇</span>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import "@/assets/scss/category.scss";
import "@/assets/scss/blog.detail.scss";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-light.css"; //样式

import { getCurrentInstance, ref, nextTick, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
const { proxy } = getCurrentInstance();
const api = {
  getBlogDetail: "view/getBlogDetail",
  loadCategory: "/view/loadCategory",
};

const leftNum = ref((window.innerWidth - 1350) / 2 + 1350 - 300);
console.log(leftNum.value);
const blogId = ref(route.params.blogId);
const blogInfo = ref({});
const getBlogDetail = async () => {
  let result = await proxy.Request({
    url: api.getBlogDetail,
    params: {
      blogId: blogId.value,
    },
  });
  if (!result) {
    return;
  }
  blogInfo.value = result.data;
  makeToc();
  highlightCode();
};
getBlogDetail();

//获取分类
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

//获取目录结构
const tocArray = ref([]);
const makeToc = () => {
  nextTick(() => {
    // 定义参与目录生成的标签
    const tocTags = ["H1", "H2", "H3", "H4", "H5", "H6"];

    // 获取所有标题标签
    let contentDom = document.querySelector("#content");
    const childNodes = contentDom.childNodes;
    let index = 0;
    childNodes.forEach((item) => {
      let tagName = item.tagName;
      if (!tagName) {
        return true;
      }
      if (tocTags.includes(tagName.toUpperCase())) {
        index++;
        let id = "toc" + index;
        item.setAttribute("id", id);
        tocArray.value.push({
          id: id,
          title: item.innerText,
          level: Number.parseInt(tagName.substring(1)),
        });
      }
    });
  });
};
const highlightCode = () => {
  nextTick(() => {
    //高亮显示
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((block) => {
      hljs.highlightBlock(block);
    });
  });
};
//获取右侧位置
const marginTop = ref(0);
onMounted(() => {
  window.addEventListener("scroll", () => {
    //var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
    // marginTop.value = scrollTop;
  });
});
</script>

<style lang="scss" >
.blog-detail {
  display: flex;
  position: relative;
  .right {
    margin-left: 0px;
    top: 90px;
    padding-top: 0px;
    position: fixed;
    .container {
      width: 300px;
      padding: 0px 10px 10px 10px;
      background: #fff;
      .toc-list {
        max-height: 400px;
        overflow: auto;
        .no-data {
          text-align: center;
          color: rgb(148, 146, 146);
          line-height: 40px;
          font-size: 13px;
        }
        .toc-item {
          line-height: 30px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;
          color: #555666;
        }
        .toc-item:hover {
          color: #c94646;
        }
      }
    }
  }

  img {
    max-width: 100%;
  }
}
</style>
