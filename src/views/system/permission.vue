<template>

    <div>
      <el-form :inline="true">
        <el-form-item label="角色名称">
          <el-input placeholder="角色名称" v-model="table.query.email" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleTableData">查询</el-button>
          <el-button type="info" icon="Refresh" @click="handleQueryRefresh">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-main style="background-color:#fff">
      <el-button type="primary" icon="Plus" @click="handleDialogAdd">新建角色</el-button>
      <el-table :data="table.data" style="width: 100%" @sort-change="handleSortChange">
        <el-table-column prop="id" label="ID" width="80" sortable="custom" />
        <el-table-column prop="name" label="名称"  width="150" />
        <el-table-column prop="status" label="状态" width="120" >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              size="large"
              inline-prompt
              active-text="启用"
              inactive-text="禁用"
              :disabled="true"
            />
          </template>
        </el-table-column>
        <el-table-column prop="menu" label="菜单组" />
        <el-table-column prop="route" label="路由组">
          <template #default="scope">
            <el-tag v-for="(val,key) of scope.row.route" :key="key" type="success" style="margin:1px">
              {{ val.path }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建日期" width="200" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button link type="primary" @click="handleDialogEdit(scope.row)">编辑</el-button>
            <el-button link type="danger" @click="handleDialogDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
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

    <!-- 处理数据|新增编辑 -->
    <el-dialog
      :title="dialog.title"
      :close-on-click-modal="false"
      v-model="dialog.visible"
      destroy-on-close
      close-on-press-escape
      center
    >
      <el-form
        ref="dialogRef"
        :model="dialog.form"
        :rules="dialog.formRule"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="dialog.form.name" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="dialog.form.status"
            :active-value="1"
            :inactive-value="0"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
        <el-form-item label="菜单" prop="menu">
          <el-input v-model="dialog.form.menu" />
        </el-form-item>
        <br/>
        <el-form-item label="路由组" prop="route">
          <div
            v-for="(val,key) of dialog.form.route" :key="key"
            style="margin-bottom: 8px;width: 100%;"
          >
              <el-link type="info">
                路由-> {{ val.path }}
              </el-link>
              &nbsp;
              <el-button
                size="small"
                type="info"
                icon="Delete"
                @click="handleRouteDel(key)"
                circle
              />
          </div>
          <el-input v-model="dialog.tempvalue" >
            <template #append>
              <el-button icon="Plus" @click="handleRouteAdd(dialog.tempvalue)" />
            </template>
          </el-input>
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
import { getSystemRole, postSystemRole, putSystemRole, deleteSystemRole } from '@/apis/system/rolepermission'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    email: null
  },
  data: []
})
const handleQueryRefresh = () => {
  table.value.query.email = null
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
  getSystemRole(table.value.query).then((result) => {
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
    name: [
      { required: true, message: '管理员名称', trigger: 'blur' },
      { min: 2, message: '用户名最少为2个字符', trigger: 'blur' }
    ]
  },
  formAction: 'add', // add|edit
  tempvalue: null
})

const handleRouteDel = (value) => { // 清理路由json.
  dialog.value.form.route.splice(value, 1)
  // value += ''
  // const allowArr = []
  // for (const i in dialog.value.form.route) {
  //   if (i !== value) allowArr.push(dialog.value.form.route[i])
  //   // console.log(dialog.value.form.route[i])
  // }
  // console.log(allowArr)
  // dialog.value.form.route = allowArr
}
const handleRouteAdd = (path) => { // 增加路由到json.
  if (typeof dialog.value.form.route === 'undefined') {
    dialog.value.form.route = []
  }
  dialog.value.form.route.push({ path })
}
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
    deleteSystemRole({ id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}
const handleSubmitForm = () => {
  // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      if (dialog.value.formAction === 'add') {
        postSystemRole(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.info(result)
          handleTableData()
        })
      } else if (dialog.value.formAction === 'edit') {
        putSystemRole(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.info(result)
          handleTableData()
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
