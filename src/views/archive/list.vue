<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="ID">
        <el-input placeholder="ID" v-model="table.query.id" clearable />
      </el-form-item>
      <el-form-item label="名称">
        <el-input placeholder="名称" v-model="table.query.name" clearable />
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select v-model="table.query.status" placeholder="上架状态" clearable>
          <el-option key="0" label="下架" value="0" />
          <el-option key="1" label="上架" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="开始日期">
        <el-date-picker v-model="table.query.updateStart" type="datetime" placeholder="选择开始时间" />
      </el-form-item>
      <el-form-item label="结束日期">
        <el-date-picker v-model="table.query.updateEnd" type="datetime" placeholder="选择开始时间" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="handleTableData">查询</el-button>
      </el-form-item>
    </el-form>
  </div>

  <el-main style="background-color:#fff">
    <el-button type="primary" icon="Plus" @click="handleDialogAdd">新增</el-button>
    <el-table :data="table.data" style="width: 100%" @sort-change="handleSortChange">
      <el-table-column fixed prop="id" label="ID" width="80" sortable="custom" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="archiveCategoryId" label="分类" >
        <template #default="scope">
        {{ dialog.vodTypeDict[scope.row.archiveCategoryId] ?? '未知' }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="上架状态">
        <template #default="scope">
          <el-link :type="scope.row.status > 0 ? 'success' : 'danger'">
            {{ scope.row.status > 0 ? scope.row.status > 1 ? scope.row.status : '上架' : '下架' }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="Pic" label="封面" align="center">
        <template #default="scope">
          <el-image style="width: 60px;min-height: 90px;" :src="scope.row.Pic" :zoom-rate="1.2"
            :preview-src-list="[scope.row.Pic]" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="updatedAt" label="最近更新" width="200" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button link type="primary" @click="handleDialogEdit(scope.row)">编辑</el-button>
          <el-button link type="danger" @click="handleDialogDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <br>

    <el-pagination background layout="total, sizes, prev, pager, next" :total="table.total" :page-size="table.query.limit"
      @current-change="handleChangePage" @size-change="handleChangeLimit" />

  </el-main>

  <el-dialog :title="dialog.title" :close-on-click-modal="false" v-model="dialog.visible" destroy-on-close
    close-on-press-escape center @close="dialog.formTempSelectType = null">

    <el-form ref="dialogRef" label-position="left" :model="dialog.form" :rules="dialog.formRule">

      <el-form-item label="状态" prop="status">
        <el-switch v-model="dialog.form.status" :active-value="1" :inactive-value="0" active-text="上架"
          inactive-text="下架" />
      </el-form-item>

      <el-form-item label="视频分类" prop="videoTypeId">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-select v-model="dialog.formTempSelectType" placeholder="选一级分类">
              <template v-for="item in dialog.vodTypeList">
                <el-option v-if="item.parent == 0" :key="item.id" :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </el-col>
          <el-col :span="12">
            <el-select v-if="dialog.formTempSelectType || dialog.form.archiveCategoryId" v-model="dialog.form.archiveCategoryId"
              placeholder="选二级分类" clearable>
              <template v-for="item in dialog.vodTypeList">
                <el-option
                  v-if="dialog.form.archiveCategoryId || dialog.formTempSelectType == item.parent || dialog.formTempSelectType == item.id"
                  :key="item.id" :label="item.name" :value="item.id" />
              </template>
            </el-select>
          </el-col>
        </el-row>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="总集数" prop="total">
            <el-input v-model="dialog.form.total" />
          </el-form-item>
        </el-col>
      </el-row>
      <br />
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="标题" prop="name">
            <el-input v-model="dialog.form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="副标题" prop="sub">
            <el-input v-model="dialog.form.sub" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="封面" prop="pic">
        <el-input v-model="dialog.form.pic" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="年份" prop="year">
            <el-input v-model="dialog.form.year" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="语言" prop="lang">
            <el-input v-model="dialog.form.lang" />
          </el-form-item>

        </el-col>
        <el-col :span="8">
          <el-form-item label="地区" prop="area">
            <el-input v-model="dialog.form.area" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="内容简介" prop="content" width="100">
        <el-input v-model="dialog.form.content" :rows="3" type="textarea" />
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
import { getArchive, addArchive, updateArchive, deleteArchive, getCategory } from '@/apis/archive'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: '-id',
    id: null,
    name: null,
    status: null
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
  getArchive(table.value.query).then((result) => {
    table.value.data = result.data
    table.value.total = result.total
  })
}

// 新增编辑数据
const dialogRef = ref(null)
const dialog = ref({
  visible: false,
  title: 'dialog',
  doubanLoadingTitle: '点击获取',
  vodTypeList: [],
  vodTypeDict: {},
  formTempSelectType: null,
  form: {},
  formRule: {
    name: [
      { required: true, message: '名称', trigger: 'blur' },
      { min: 2, message: '用户名最少为2个字符', trigger: 'blur' }
    ],
    pic: [
      { required: true, message: '封面', trigger: 'blur' },
      { min: 2, message: '用户名最少为5个字符', trigger: 'blur' }
    ]
  },
  formAction: 'add'
})

const handleDialogAdd = () => {
  dialog.value.title = '新增资料'
  dialog.value.visible = true
  dialog.value.formAction = 'add'
  dialog.value.form = {}
}
const handleDialogEdit = (row) => {
  dialog.value.title = '修改资料-' + row.name
  dialog.value.visible = true
  dialog.value.formAction = 'edit'
  dialog.value.form = row
}
const handleSubmitForm = () => { // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      if (dialog.value.formAction === 'add') {
        addArchive(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.success(result)
          handleTableData()
        })
      } else if (dialog.value.formAction === 'edit') {
        updateArchive(dialog.value.form).then((result) => {
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
  ElMessageBox.confirm('请仔细确认是否删除 ' + row.fileName + ' ?', '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteArchive({ id: row.id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}

const handleSelectType = () => {
  getCategory({ limit: 9999 }).then((result) => {
    dialog.value.vodTypeList = result.data
    for (const item of result.data) {
      dialog.value.vodTypeDict[item.id] = item.name
    }
  })
}
handleSelectType()

handleTableData()

</script>
