<script setup>
/**
 * 分页组件
 * @type {ModelRef<CommonViewFns & CommonViewConfig>}
 */
const pageConfig = defineModel({})
</script>

<template>
  <el-pagination
    background
    :total="pageConfig.total"
    :page-sizes="[10, 20, 50, 100]"
    :page-size="pageConfig.pageSize"
    :current-page="pageConfig.pageNum"
    @size-change="pageConfig.pageSizeChange"
    @current-change="pageConfig.pageNumChange"
    layout="total, sizes, prev, pager, next, jumper"
  >
  </el-pagination>
</template>
