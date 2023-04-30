<template>

    <div>
      <el-form :inline="true">
        <el-form-item label="管理员">
          <el-input placeholder="管理员ID" v-model="table.query.admin" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleTableData">查询</el-button>
          <el-button type="info" icon="Refresh" @click="handleQueryRefresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-main style="background-color:#fff">
    <el-table :data="table.data" style="width: 100%" @sort-change="handleSortChange">
      <el-table-column prop="id" label="ID" width="80" sortable="custom" />
      <el-table-column prop="AdminUser.nickname" label="管理员" width="80" />
      <el-table-column prop="AdminUser.id" label="管理ID" width="80" />
      <el-table-column prop="ip" label="来源IP地址" width="120" />
      <el-table-column prop="path" label="请求地址" />
      <el-table-column prop="method" label="请求方法" width="100" />
      <el-table-column prop="payload" label="请求参数" align-header="center">
        <template #default="scope">
          <pre>{{ scope.row.payload }}</pre>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态码" width="100" />
      <el-table-column prop="createdAt" label="创建日期" width="200" />
    </el-table>

    <br>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :total="table.total"
      :default-page-size="table.query.limit"
      @current-change="handleChangePage"
      @size-change="handleChangeLimit"
    />

  </el-main>

</template>
<script setup>
import { ref } from 'vue'
import { getSystemAccesslog } from '@/apis/system/accesslog'

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: '-id',
    admin: null
  },
  data: []
})
const handleQueryRefresh = () => {
  table.value.query.admin = null
  handleTableData()
}
const handleChangePage = (value) => {
  table.value.query.page = value
  handleTableData()
}
const handleChangeLimit = (value) => {
  table.value.query.limit = value
  handleTableData()
}
const handleSortChange = ({ column, prop, order }) => {
  let orderSymbol = ''
  if (order === 'descending') {
    orderSymbol = '-'
  } else if (order === 'ascending') {
    orderSymbol = '+'
  }
  table.value.query.order = orderSymbol + prop
  handleTableData()
}
const handleTableData = () => {
  getSystemAccesslog(table.value.query).then((result) => {
    table.value.data = result.data
    table.value.total = result.total
  })
}

handleTableData()

</script>
