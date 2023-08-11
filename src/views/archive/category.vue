<template>
  <el-main style="background-color:#fff">
    <el-button
      type="primary"
      icon="Plus"
      @click="handleDialogAdd"
    >
      新增
    </el-button>
    <el-table
      :data="table.data"
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column
        fixed
        prop="id"
        label="ID"
        width="80"
        sortable="custom"
      />
      <el-table-column
        prop="name"
        label="名称"
        width="140"
      />
      <el-table-column
        prop="parent"
        label="父级"
        width="180"
      >
        <template #default="scope">
          {{ scope.row.parent != 0 ? scope.row.parent : '父级分类' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="180"
      >
        <template #default="scope">
          <el-link
            :type="scope.row.status > 0 ? 'success' : 'danger'"
          >
            {{ scope.row.status > 0 ? scope.row.status > 1 ? scope.row.status : '开启' : '关闭' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="order"
        label="排序"
        width="180"
      />
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
        width="120"
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

  <!-- 处理数据|新增编辑 -->
  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    destroy-on-close
    close-on-press-escape
    center
  >
    <el-form
      ref="dialogRef"
      label-position="left"
      :model="dialog.form"
      :rules="dialog.formRule"
    >
      <el-form-item
        label="名称"
        prop="name"
      >
        <el-input v-model="dialog.form.name" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch
          v-model="dialog.form.status"
          size="large"
          active-text="开启"
          inactive-text="关闭"
          :active-value="1"
          :inactive-value="0"
        />
      </el-form-item>
      <el-form-item
        label="父级"
        prop="parent"
      >
        <el-input-number v-model="dialog.form.parent" />
      </el-form-item>
      <el-form-item
        label="排序"
        prop="order"
      >
        <el-input v-model="dialog.form.order" />
      </el-form-item>
      <el-form-item
        label="内容"
        prop="content"
      >
        <el-input
          v-model="dialog.form.content"
          type="textarea"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="handleSubmitForm"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

// import api
import { addCategory, getCategory, updateCategory, deleteCategory } from '@/apis/archive'
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
  getCategory(table.value.query).then((result) => {
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
      { required: true, message: '名称', trigger: 'blur' },
      { min: 2, message: '用户名最少为2个字符', trigger: 'blur' }
    ]
  },
  formAction: 'add' // add|edit
})
const handleDialogAdd = () => {
  dialog.value.title = '新增模板组'
  dialog.value.visible = true
  dialog.value.formAction = 'add'
  dialog.value.form = {}
}
const handleDialogEdit = (row) => {
  dialog.value.title = '修改模板组'
  dialog.value.visible = true
  dialog.value.formAction = 'edit'
  dialog.value.form = row
}

const handleSubmitForm = () => { // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      if (dialog.value.formAction === 'add') {
        addCategory(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.success(result)
          handleTableData()
        })
      } else if (dialog.value.formAction === 'edit') {
        updateCategory(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.info(result)
          handleTableData()
        })
        dialog.value.visible = false
      } else {
        ElMessage.warning('提交错误')
      }
    } else {
      ElMessage.error('请输入正确的数据！')
    }
  })
}

const handleDialogDelete = (row) => {
  ElMessageBox.confirm('请仔细确认是否删除 ' + row.name + ' ?', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteCategory({ id: row.id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}

handleTableData()

</script>
