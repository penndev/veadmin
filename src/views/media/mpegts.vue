<template>

    <div>
      <el-form :inline="true">
        <el-form-item label="名称">
          <el-input placeholder="名称" v-model="table.query.name" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleTableData">查询</el-button>
          <el-button type="info" icon="Refresh" @click="handleQueryRefresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-main style="background-color:#fff">
      <el-button type="primary" icon="Plus" @click="handleDialogAdd">新增</el-button>
      <el-table :data="table.data" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column fixed prop="id" label="ID" width="80" sortable="custom" />
        <el-table-column prop="mediaId" label="文件ID" width="80" align="center" />
        <el-table-column prop="status" label="状态" width="60" align="center"  />
        <el-table-column prop="tsPath" label="文件" width="180" align="center" />
        <el-table-column prop="tsSize" label="大小" width="100" align="center"  />
        <el-table-column prop="tsSeq" label="序号" width="60" align="center" />
        <el-table-column prop="tsExtinf" label="EXT-INF" width="100" align="center"  />

        <el-table-column prop="updatedAt" label="更新日期" width="240" align="center" />
        <el-table-column prop="createdAt" label="创建日期" width="240" align="center" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="handleDialogEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDialogDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <br>

      <el-pagination background layout="total, sizes, prev, pager, next" :total="table.total"
      :page-size="table.query.limit" @current-change="handleChangePage" @size-change="handleChangeLimit" />

    </el-main>

    <!-- 处理数据|新增编辑 -->
    <el-dialog
      :title="dialog.title"
      :close-on-click-modal="false"
      v-model="dialog.visible"
      destroy-on-close close-on-press-escape
      center
    >

      <el-form
        ref="dialogRef"
        label-width="80px"
        :model="dialog.form"
        :rules="dialog.formRule"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="dialog.form.email" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialog.visible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

  </template>

<script setup>
import { ref } from 'vue'

// import api
import { getMediaTs, postMediaTs, putMediaTs, deleteMediaTs } from '@/apis/media'
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
  getMediaTs(table.value.query).then((result) => {
    table.value.data = result.data
    table.value.total = result.total
  })
}

// 新增编辑数据
const dialogRef = ref(null)
const dialog = ref({
  visible: false,
  title: 'dialog',
  form: {},
  formRule: {
    email: [
      { required: true, message: '邮箱', trigger: 'blur' },
      { min: 5, message: '用户名最少为5个字符', trigger: 'blur' }
    ]
  },
  formAction: 'add' // add|edit
})
const handleDialogAdd = () => {
  dialog.value.title = '创建数据'
  dialog.value.visible = true
  dialog.value.formAction = 'add'
  dialog.value.form = {}
}
const handleDialogEdit = (row) => {
  dialog.value.title = '创建数据'
  dialog.value.visible = true
  dialog.value.formAction = 'edit'
  dialog.value.form = row
}
const handleDialogDelete = (id) => {
  ElMessageBox.confirm('请仔细确认是否删除?', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteMediaTs({ id }).then((result) => {
      ElMessage.warning(result)
    })
  })
}
const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      if (dialog.value.formAction === 'add') {
        postMediaTs(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.info(result)
        })
      } else if (dialog.value.formAction === 'edit') {
        putMediaTs(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.info(result)
        })
        dialog.value.visible = false
      } else {
        ElMessage.info('提交错误')
      }
    } else {
      ElMessage.error('请输入正确的数据！')
    }
  })
}

handleTableData()

</script>
