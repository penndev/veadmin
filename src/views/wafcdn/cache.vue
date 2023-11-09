<template>
  <!-- 顶部筛选框 -->
  <div>
    <el-form :inline="true">
      <el-form-item label="路径">
        <el-input
          v-model="table.query.path"
          placeholder="/url"
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
      size="small"
      :icon="table.selectStat? 'SemiSelect':'Select'"
      @click="table.selectStat = !table.selectStat"
    />
    <el-button
      v-if="table.selectStat"
      size="small"
      @click="handleInvertSelection"
    >
      反选
    </el-button>
    <el-button
      v-if="table.selectStat"
      size="small"
      @click="tableRef.clearSelection"
    >
      清空
    </el-button>
    <el-button
      v-if="table.selectStat"
      size="small"
      type="danger"
      @click="handleDeleteMore"
    >
      删除选中
    </el-button>
    <!-- 数据table -->
    <el-table
      ref="tableRef"
      :data="table.data"
      @sort-change="handleSortChange"
    >
      <el-table-column
        v-if="table.selectStat"
        type="selection"
        width="50"
      />
      <el-table-column
        label="站点"
        prop="SiteID"
      />

      <el-table-column
        label="路径"
        align="center"
      >
        <template #default="scope">
          <el-tooltip
            :content="scope.row.File"
            placement="top"
          >
            <el-link>{{ scope.row.Path }}</el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="文件大小"
        align="center"
      >
        <template #default="scope">
          <el-link>{{ fileSizeFormat(scope.row.Size) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="访问日期"
        align="center"
      >
        <template #default="scope">
          <el-link>{{ dateFormat("Y-m-d H:i:s" ,scope.row.Accessed) }}</el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="过期时间"
        align="center"
      >
        <template #default="scope">
          <el-tooltip
            :content="'创建：' + scope.row.CreatedAt"
            placement="top"
          >
            <el-link>{{ dateFormat("Y-m-d H:i:s" ,scope.row.Expried) }}</el-link>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="65"
      >
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDialogDelete(scope.row)"
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
import { fileSizeFormat, dateFormat } from '@/utils'

const tableRef = ref()

const handleInvertSelection = () => {
  table.value.data.forEach((row) => {
    tableRef.value.toggleRowSelection(row)
  })
}

const table = ref({
  selectStat: false,
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    path: null
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

const handleDialogDelete = (row) => {
  ElMessageBox.confirm(`请仔细确认是否删除数据[${row.File}]?`, '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteCache({ file: row.File }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}

const handleDeleteMore = () => {
  const rows = tableRef.value.getSelectionRows()
  let files = ''
  rows.forEach((row) => {
    if (files !== '') {
      files += ','
    }
    files += row.File
  })
  ElMessageBox.confirm(`请仔细确认是否删除 ${rows.length} 条数据?`, '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteCache({ file: files }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}

handleTableData()

</script>
