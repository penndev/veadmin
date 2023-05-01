<template>

  <div>
    <el-form :inline="true">
      <el-form-item label="源文件">
        <el-input placeholder="源文件" v-model="table.query.fileId" clearable />
      </el-form-item>
      <el-form-item label="编码器">
        <el-input placeholder="编码器" v-model="table.query.transcodeId" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleTableData">查询</el-button>
        <el-button type="info" icon="Refresh" @click="handleQueryRefresh">重置</el-button>
      </el-form-item>
    </el-form>
  </div>

  <el-main style="background-color:#fff">
    <el-table :data="table.data" @sort-change="handleSortChange">
      <el-table-column fixed prop="id" label="ID" width="80" sortable="custom" align="center" />
      <el-table-column prop="fileId" label="文件" min-width="180" align="center">
        <template #default="scope">{{ scope.row.VideoFile.fileName }}</template>
      </el-table-column>
      <el-table-column prop="transcodeId" label="编码器" min-width="80" align="center" >
        <template #default="scope">{{ scope.row.VideoTranscode.name }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120" align="center" >
        <template #default="scope">
          <el-link @click="handleStatus(scope.row)" :type="scope.row.status > 0?'success':'danger'">{{ table.querySelect.status[scope.row.status] }}</el-link>
          <el-progress v-if="scope.row.status==0 && scope.row.progress" type="circle" :percentage="scope.row.progress" :width="60" />
        </template>
      </el-table-column>
      <el-table-column label="执行参数" min-width="180"  header-align="center">
        <template #default="scope">
          <pre>{{ scope.row.options }}</pre>
        </template>
      </el-table-column>
      <el-table-column label="输出文件路径" min-width="200" align="center">
        <template #default="scope">
          <el-link @click="copyPath(scope.row.outFile)">{{ scope.row.outFile }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建日期" min-width="170" align="center" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="danger" @click="handleDialogDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination background layout="total, sizes, prev, pager, next" :total="table.total"
      :page-size="table.query.limit" @current-change="handleChangePage" @size-change="handleChangeLimit" />

  </el-main>

  <!-- 播放dialog -->
  <el-dialog v-model="playDialogVisible" title="播放" width="40%" destroy-on-close center>
    <play :options="playOptions" />
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="playDialogVisible = false">
          关闭
        </el-button>
      </span>
    </template>
  </el-dialog>

</template>

<script setup>
import play from '@/components/video.vue'
import { ref } from 'vue'
// import api
import { listTask, deleteTask, progressTask } from '@/apis/video'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  total: 0,
  data: [],
  query: {
    limit: 20,
    page: 1,
    order: null,
    fileId: null,
    transcodeId: null
  },
  querySelect: {
    status: {
      '-1': '转码失败',
      0: '转码中',
      1: '转码成功'
    }
  }
})
const handleQueryRefresh = (value) => {
  table.value.query.fileName = null
  table.value.query.fileMd5 = null
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
  listTask(table.value.query).then((result) => {
    table.value.data = result.data
    table.value.total = result.total
  })
}

// 删除数据
const handleDialogDelete = (row) => {
  ElMessageBox.confirm('请仔细确认是否删除 ' + row.name + ' ?', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteTask({ id: row.id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}

// 播放弹窗
const playDialogVisible = ref(false)
const playOptions = ref({})
const handlePlay = (path) => {
  playOptions.value = {
    autoplay: true,
    controls: true,
    sources: [
      path
    ],
    html5: {
      vhs: {
        cacheEncryptionKeys: true
      }
    }
  }
  playDialogVisible.value = true
}
const copyPath = (path) => {
  const textarea = document.createElement('textarea')
  textarea.value = path
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
  ElMessage.info('复制成功')
}

// 处理状态点击框
const handleStatus = (row) => {
  if (row.status === 0) {
    progressTask({ id: row.id }).then(resp => {
      row.progress = Math.floor(resp.progress)
    })
  } else if (row.status === 1) {
    handlePlay(row.OutFile)
  }
}

handleTableData()

</script>

<style lang="scss" scoped>

pre{
  white-space: pre-wrap;
  word-wrap: break-word;
}

.ea-tag{
  margin: 2px;
}

</style>
