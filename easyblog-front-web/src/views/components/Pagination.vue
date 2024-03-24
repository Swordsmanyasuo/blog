<template>
  <div class="pagination">
    <el-pagination background
                   layout="prev, pager, next"
                   :total="total"
                   :page-size="pageSize"
                   :current-page="pageNo"
                   @current-change="changePageNo"
                   v-if="total>0" />
  </div>
</template>

<script setup>
const props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 0,
  },
  pageNo: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["pageChange"]);
const changePageNo = (pageNo) => {
  emit("pageChange", pageNo);
};
</script>

<style lang="scss" scoped>
</style>
