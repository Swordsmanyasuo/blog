<template>
  <div>
    <div id="SOHUCS"
         :sid="sid"
         v-if="show"></div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue"
const loadScript = (url, callback) => {
  let script = document.createElement('script');
  if (script.readyState) {
    // IE浏览器
    script.onreadystatechange = function () {
      if (script.readyState === 'loaded' || script.readyState === 'complete') {
        script.onreadystatechange = null;
        callback();
      }
    }
  } else {
    // 其他浏览器
    script.onload = function () {
      callback();
    }
  }
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}

onMounted(() => {
  if (checkImportChangyan()) {
    return;
  }
  window.changyan = undefined;
  window.cyan = undefined;
  loadScript("https://cy-cdn.kuaizhan.com/upload/changyan.js", () => {
    window.changyan.api.config({
      appid: "cyvP1EXdR", // 此处换成你的畅言应用的appid,
      conf: "0264664c4b9d1fb578d732b34abf3246", // 此处换成你畅言应用的conf。
    });
  });
})

const show = ref(true);
onBeforeUnmount(() => {
  show.value = false;
})

const checkImportChangyan = () => {
  let scriptArray = document.querySelectorAll("script");
  let haveImport = false;
  scriptArray.forEach(element => {
    const src = element.getAttribute("src")
    if (src.indexOf("changyan.js") != -1) {
      haveImport = true;
      return false;
    }
  });
  return haveImport;
}

const sid = ref(new Date().getTime());
</script>

<style lang="scss">
</style>