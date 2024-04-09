<template>
  <el-main class="ea-table">
    <el-button
      type="primary"
      icon="Plus"
      @click="handleDialogAdd"
    >
      新增
    </el-button>
    <el-table
      :data="table.data"
      row-key="id"
      default-expand-all
    >
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column
        prop="status"
        label="状态"
      >
        <template #default="scope">
          <el-link
            :type="scope.row.status > 0 ? 'success' : 'danger'"
            @click="handleDialogEditStatus(scope.row)"
          >
            {{ scope.row.status > 0 ? scope.row.status > 1 ? scope.row.status : '开启' : '关闭' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="order"
        label="排序"
        sortable
      />
      <el-table-column
        prop="updatedAt"
        label="最近更新"
      />
      <el-table-column
        prop="createdAt"
        label="创建日期"
      />
      <el-table-column
        align="center"
        label="操作"
        min-width="120"
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
  query: {
    limit: 9999,
    page: 1,
    order: null,
    name: null
  },
  data: []
})

const handleTableData = () => {
  getCategory(table.value.query).then((result) => {
    const parentList = []
    const childMap = {}
    for (const item of result.data) {
      if (item.parent < 1) {
        parentList.push(item)
      } else {
        if (childMap[item.parent]) {
          childMap[item.parent].push(item)
        } else {
          childMap[item.parent] = [item]
        }
      }
    }
    for (const i of parentList.keys()) {
      const parentID = parentList[i].id
      if (childMap[parentID]) {
        parentList[i].children = childMap[parentID]
      }
    }
    table.value.data = parentList
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
const handleDialogEditStatus = (row) => {
  const action = () => {
    updateCategory({
      id: row.id,
      status: !row.status
    }).then((result) => {
      row.status = !row.status
      ElMessage.info(result)
    })
  }
  if (row.status) {
    ElMessageBox.confirm('请仔细确认是否下架 ' + row.name + ' ?', '警告', {
      confirmButtonText: '下架',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      action()
    })
  } else {
    action()
  }
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
