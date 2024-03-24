<template>
  <div class="category-body">
    <div class="category-list">
      <div class="category-panel"
           v-for="item in categoryList">
        <div class="category-panel-inner">
          <div class="category-image">
            <img :src="proxy.globalInfo.getImageUrl + item.cover"
                 v-if="item.cover" />
            <img src="@/assets/default_img.png"
                 v-else />
          </div>
          <div class="category-info">
            <div class="category-title"
                 :title="item.categoryName">
              <router-link v-if="item.categoryType==0"
                           :to="'category/'+item.categoryId">{{item.categoryName}}</router-link>
              <router-link v-if="item.categoryType==1"
                           :to="'special/'+item.categoryId">{{item.categoryName}}</router-link>
            </div>
            <div class="category-desc"
                 :title="item.categoryDesc">{{item.categoryDesc}}</div>
            <div class="blog-count">文章数：{{item.blogCount}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-panel"
         v-if="categoryType==1">
      <Pagination :total="specialDataInfo.totalCount"
                  :pageSize="specialDataInfo.pageSize"
                  :pageNo="specialDataInfo.pageNo"
                  @pageChange="pageChange4BlogList"></Pagination>
    </div>
  </div>

</template>

<script setup>
import { getCurrentInstance, ref } from "vue"
const { proxy } = getCurrentInstance();

const props = defineProps({
  categoryType: {
    type: Number
  }
})

const api = {
  "loadCategory": "view/loadCategory",
  "loadSpecial": "view/loadSpecial"
}


const init = () => {
  if (props.categoryType == 0) {
    loadCategory();
  } else {
    loadSpecial(1);
  }
}

const categoryList = ref([]);
const loadCategory = async () => {
  let result = await proxy.Request({
    url: api.loadCategory,
  })
  if (!result) {
    return;
  }
  categoryList.value = result.data;
}

const specialDataInfo = ref({});
const loadSpecial = async (pageNo) => {
  let result = await proxy.Request({
    url: api.loadSpecial,
    params: {
      pageNo: pageNo,
      pageSize: 20,
    }
  })
  if (!result) {
    return;
  }
  specialDataInfo.value = result.data;
  categoryList.value = result.data.list;
}

const pageChange4BlogList = (pageNo) => {
  loadSpecial(pageNo);
};

init();

</script>

<style lang="scss" scoped>
.category-body {
  background: #fff;
  .category-list {
    background: #fff;
    padding: 10px 10px;
    display: flex;
    flex-wrap: wrap;
    .category-panel {
      width: 25%;
      padding: 10px;
      .category-panel-inner {
        background: #fff;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
        .category-image {
          width: 100px;
          height: 100px;
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
          margin-left: 110px;
          font-size: 14px;
          .category-title {
            max-width: 100%;
            font-size: 20px;
            font-weight: bold;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
          }
          .category-desc {
            max-width: 100%;
            margin-top: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
          }
          .blog-count {
            font-size: 13px;
            margin-top: 10px;
            color: #919da9;
          }
        }
      }
    }
  }
  .page-panel {
    padding: 0px 0px 10px 20px;
  }
}
</style>
