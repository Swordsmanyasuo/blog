<template>
  <div class="user-container">
    <div class="user-item"
         :id="item.userId"
         v-for="item in userList">
      <div class="user-icon">
        <img :src="proxy.globalInfo.getImageUrl + item.avatar"
             v-if="item.avatar" />
        <img src="@/assets/default_avatar.png"
             v-else />
      </div>
      <div class="user-info">
        <div class="nick-name">{{item.nickName}}</div>
        <div class="profession">
          <span>职位：{{item.profession}}</span>
          <span class="blog-count">博客：{{item.blogCount}}篇</span>
        </div>
        <div class="introduction"
             v-html="item.introduction">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, ref } from "vue"
const { proxy } = getCurrentInstance();


const api = {
  "loadTeamUser": "view/loadTeamUser"
}
const userList = ref([]);
const loadUser = async () => {
  let result = await proxy.Request({
    url: api.loadTeamUser,
  })
  if (!result) {
    return;
  }
  userList.value = result.data;
}
loadUser();
</script>

<style lang="scss" scoped>
.user-container {
  padding: 0px;

  .user-item {
    display: flex;
    align-items: flex-start;
    background: #fff;
    margin-bottom: 20px;
    margin-top: 0px;
    padding: 10px 20px;
    border-radius: 5px;

    .user-icon {
      width: 200px;
      height: 200px;
      background: #ddd;
      border-radius: 100px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      img {
        max-width: 100%;
      }
    }

    .user-info {
      flex: 1;
      display: block;
      padding-top: 20px;
      margin-left: 20px;
      .nick-name {
        font-weight: bold;
      }
      .profession {
        margin-top: 10px;
      }
      span {
        color: #0b1c2c;
        display: inline-block;
        font-size: 14px;
        word-wrap: break-word;
        word-break: break-all;
        white-space: normal;
      }

      .blog-count {
        margin-left: 20px;
        width: 100px;
      }

      .introduction {
        margin-top: 10px;
        font-size: 14px;
        word-wrap: break-word !important;
        word-break: break-all !important;
        white-space: normal !important;
        img {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
