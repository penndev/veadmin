<template>
  <el-pagination
    background
    layout="total, sizes, prev, pager, next"
    :page-size="pageSize"
    @size-change="handleChangeLimit"
  />
</template>

<script setup>
import { paginationStore } from '@/stores/index'
import { useRoute } from 'vue-router'

const pagination = paginationStore()

const route = useRoute()
const pageSize = defineModel('pageSize', { type: Number, required: true })

// 从初始化读取值
if (pagination.data[route.path] && pageSize.value !== pagination.data[route.path] && pagination.data[route.path] > 0) {
  pageSize.value = pagination.data[route.path]
}

// 存储记忆
const handleChangeLimit = (value) => {
  pagination.data[route.path] = value
}
</script>
