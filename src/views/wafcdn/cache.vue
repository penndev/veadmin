<template>
  <!-- 顶部筛选框 -->
  <div>
    <el-form :inline="true">
      <el-form-item label="名称">
        <el-input
          v-model="table.query.name"
          placeholder="名称"
          clearable
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="search"
          @click="handleTableData"
        >
          查询
        </el-button>
        <el-button
          type="info"
          icon="Refresh"
          @click="handleQueryRefresh"
        >
          重置
        </el-button>
      </el-form-item>
    </el-form>
  </div>

  <!-- 数据展示框 -->
  <el-main style="background-color:#fff">
    <!-- 数据操作按钮 -->
    <el-button
      type="primary"
      icon="Plus"
      @click="handleDialogAdd"
    >
      新增
    </el-button>

    <!-- 数据table -->
    <el-table
      :data="table.data"
      @sort-change="handleSortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        width="80"
        sortable="custom"
      />

      <el-table-column
        label="名称"
        prop="nickname"
        width="160"
        align="center"
      />

      <el-table-column
        label="邮箱"
        width="240"
      >
        <template #default="scope">
          <a target="_blank">{{ scope.row.email }}</a>
        </template>
      </el-table-column>

      <el-table-column
        prop="updatedAt"
        label="最近更新"
        width="200"
      />

      <el-table-column
        prop="createdAt"
        label="创建日期"
        width="200"
      />

      <el-table-column
        fixed="right"
        label="操作"
        width="105"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleDialogEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDialogDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next"
      :total="table.total"
      :page-size="table.query.limit"
      @current-change="handleChangePage"
      @size-change="handleChangeLimit"
    />
  </el-main>
</template>

<script setup>
import { ref } from 'vue'

// import api
import { getCache, deleteCache } from '@/apis/wafcdn'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    name: null
  },
  data: []
})
const handleQueryRefresh = (value) => {
  table.value.query.name = null
  table.value.query.order = null
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
  getCache(table.value.query).then((result) => {
    table.value.data = result.data
    table.value.total = result.total
  })
}

const handleDialogDelete = (id) => {
  ElMessageBox.confirm(`请仔细确认是否删除数据[${id}]?`, '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteCache({ id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}

handleTableData()

</script>
