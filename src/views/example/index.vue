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
          @click="table.handleTableData"
        >
          查询
        </el-button>
        <el-button
          type="info"
          icon="Refresh"
          @click="table.handleQueryRefresh"
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
      :icon="table.selectStat? 'SemiSelect':'Select'"
      @click="table.selectStat = !table.selectStat"
    />
    <el-button
      v-if="table.selectStat"
      @click="table.handleInvertSelection"
    >
      反选
    </el-button>
    <el-button
      v-if="table.selectStat"
      @click="tableRef.clearSelection()"
    >
      清空
    </el-button>

    <el-button
      type="primary"
      icon="Plus"
      @click="dialog.handleDialogAdd"
    >
      新增
    </el-button>

    <!-- 数据table -->
    <el-table
      :data="table.data"
      @sort-change="table.handleSortChange"
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
            @click="dialog.handleDialogEdit(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="dialog.handleDialogDelete(scope.row.id)"
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
      @current-change="table.handleChangePage"
      @size-change="table.handleChangeLimit"
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
        label="邮箱"
        prop="email"
      >
        <el-input v-model="dialog.form.email" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialog.visible = false">取消</el-button>
        <el-button
          type="primary"
          @click="dialog.handleSubmitForm"
        >确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

// import api
import { getExample, postExample, putExample, deleteExample } from '@/apis/example'
import { ElMessage, ElMessageBox } from 'element-plus'

const tableRef = ref()

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: null,
    name: null
  },
  data: [],
  handleTableData: () => {
    getExample(table.value.query).then((result) => {
      table.value.data = result.data
      table.value.total = result.total
    })
  },
  handleQueryRefresh: (value) => {
    table.value.query.name = null
    table.value.query.order = null
    table.value.handleTableData()
  },
  handleChangePage: (value) => {
    table.value.query.page = value
    table.value.handleTableData()
  },
  handleChangeLimit: (value) => {
    table.value.query.limit = value
    table.value.handleTableData()
  },
  handleSortChange: ({ column, prop, order }) => {
    let orderSymbol = ''
    if (order === 'descending') {
      orderSymbol = '-'
    } else if (order === 'ascending') {
      orderSymbol = '+'
    }
    table.value.query.order = orderSymbol + prop
    table.value.handleTableData()
  },
  handleInvertSelection: () => {
    table.value.data.forEach((row) => {
      tableRef.value.toggleRowSelection(row)
    })
  }
})

// dialog 的 element 实例
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
  formAction: 'add', // add|edit
  handleDialogAdd: () => {
    dialog.value.title = '创建数据'
    dialog.value.visible = true
    dialog.value.formAction = 'add'
    dialog.value.form = {}
  },
  handleDialogEdit: (row) => {
    dialog.value.title = '编辑数据'
    dialog.value.visible = true
    dialog.value.formAction = 'edit'
    dialog.value.form = row
  },
  handleSubmitForm: () => { // 提交数据
    dialogRef.value.validate((validate) => {
      if (validate) { // 判断表单是否验证通过。
        if (dialog.value.formAction === 'add') {
          postExample(dialog.value.form).then((result) => {
            dialog.value.visible = false
            ElMessage.info(result)
            table.value.handleTableData()
          })
        } else if (dialog.value.formAction === 'edit') {
          putExample(dialog.value.form).then((result) => {
            dialog.value.visible = false
            ElMessage.info(result)
            table.value.handleTableData()
          })
        } else {
          ElMessage.error('提交错误')
        }
      } else {
        ElMessage.error('请输入正确的数据！')
      }
    })
  },
  handleDialogDelete: (id) => {
    ElMessageBox.confirm(`请仔细确认是否删除数据[${id}]?`, '警告', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteExample({ id }).then((result) => {
        ElMessage.warning(result)
        table.value.handleTableData()
      })
    })
  }
})

table.value.handleTableData()

</script>
