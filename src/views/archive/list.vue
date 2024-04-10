<template>
  <div>
    <el-form :inline="true">
      <el-form-item label="ID">
        <el-input
          v-model="table.query.id"
          placeholder="ID"
          style="max-width: 120px;"
        />
      </el-form-item>
      <el-form-item label="名称">
        <el-input
          v-model="table.query.name"
          placeholder="名称"
          style="max-width: 180px;"
        />
      </el-form-item>
      <el-form-item label="上架状态">
        <el-select
          v-model="table.query.status"
          placeholder="上架状态"
          clearable
          style="max-width: 150px;"
        >
          <el-option
            :key="0"
            label="下架"
            :value="0"
          />
          <el-option
            :key="1"
            label="上架"
            :value="1"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker
          v-model="table.query.updateStart"
          type="datetime"
          placeholder="选择开始时间"
          style="max-width: 180px;"
        />
        &nbsp;
        <el-date-picker
          v-model="table.query.updateEnd"
          type="datetime"
          placeholder="选择结束时间"
          style="max-width: 180px;"
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
      </el-form-item>
    </el-form>
  </div>

  <el-main class="ea-table">
    <!-- 处理操作按钮 -->
    <el-button
      type="primary"
      icon="Plus"
      @click="handleDialogAdd"
    >
      新增
    </el-button>

    <el-table
      :data="table.data"
      @sort-change="handleSortChange"
    >
      <el-table-column
        label="ID"
        prop="id"
        fixed
        width="80"
        sortable="custom"
      />

      <el-table-column
        label="名称"
        prop="name"
        align="center"
      />

      <el-table-column
        label="分类"
        align="center"
      >
        <template #default="scope">
          {{ dialog.vodTypeDict[scope.row.archiveCategoryId] ?? '未知' }}
        </template>
      </el-table-column>

      <el-table-column
        label="封面"
        align="center"
      >
        <template #default="scope">
          <el-image
            :src="scope.row.Pic"
            :zoom-rate="1.2"
            :preview-src-list="[scope.row.Pic]"
            fit="cover"
            style="width: 60px;min-height: 90px;"
          />
        </template>
      </el-table-column>

      <el-table-column
        label="上架状态"
        align="center"
      >
        <template #default="scope">
          <el-link
            :type="scope.row.status > 0 ? 'success' : 'danger'"
            @click="handleDialogEditStatus(scope.row)"
          >
            {{ scope.row.status > 0 ? scope.row.status > 1 ? scope.row.status : '上架' : '下架' }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column
        label="标签"
        width="250"
        align="center"
      >
        <template #default="scope">
          <el-tag
            v-for="tag in scope.row.Tags"
            :key="tag.id"
            closable
            style="margin:2px 3px;"
            @close="handleDeleteTagMap(tag.id, scope.row.Tags)"
          >
            {{ tag?.ArchiveTag.name }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="最近更新"
        prop="updatedAt"
        width="200"
        align="center"
      />
      <el-table-column
        label="操作"
        fixed="right"
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

  <el-dialog
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    destroy-on-close
    close-on-press-escape
    center
    @close="dialog.formTempSelectType = null"
  >
    <el-form
      ref="dialogRef"
      :model="dialog.form"
      :rules="dialog.formRule"
      label-width="80px"
    >
      <el-form-item
        label="状态"
        prop="status"
      >
        <el-switch
          v-model="dialog.form.status"
          :active-value="1"
          active-text="上架"
          :inactive-value="0"
          inactive-text="下架"
        />
      </el-form-item>

      <el-form-item
        label="视频分类"
        prop="videoTypeId"
      >
        <el-col
          :span="8"
        >
          <el-select
            v-model="dialog.formTempSelectType"
            placeholder="选一级分类"
            style="width: 100%;"
          >
            <template v-for="item in dialog.vodTypeList">
              <el-option
                v-if="item.parent == 0"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </template>
          </el-select>
        </el-col>
        <el-col
          :span="2"
        />
        <el-col
          :span="8"
        >
          <el-select
            v-if="dialog.formTempSelectType || dialog.form.archiveCategoryId"
            v-model="dialog.form.archiveCategoryId"
            placeholder="选二级分类"
          >
            <template v-for="item in dialog.vodTypeList">
              <el-option
                v-if="dialog.form.archiveCategoryId
                  || dialog.formTempSelectType == item.parent
                  || dialog.formTempSelectType == item.id"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </template>
          </el-select>
        </el-col>
      </el-form-item>

      <el-form-item
        v-if="dialog.formAction == 'edit'"
        label="标签栏"
        prop="status"
      >
        <el-tag
          v-for="tag in dialog.form.Tags"
          :key="tag.id"
          closable
          style="margin: 6px;"
          @close="handleDeleteTagMap(tag.id)"
        >
          {{ tag.ArchiveTag.name }}
        </el-tag>
        <el-col :span="8">
          <el-select
            v-model="dialog.formTempSelectTag"
            filterable
            remote
            reserve-keyword
            placeholder="搜索标签名称"
            :remote-method="handleRemoteTagList"
            @change="handleRemoteTagSelect"
          >
            <el-option
              v-for="item in dialog.vodTagList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </el-col>
      </el-form-item>
      <br>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="总集数"
            prop="total"
          >
            <el-input v-model="dialog.form.total" />
          </el-form-item>
        </el-col>
      </el-row>
      <br>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            label="标题"
            prop="name"
          >
            <el-input v-model="dialog.form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="副标题"
            prop="sub"
          >
            <el-input v-model="dialog.form.sub" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="封面"
        prop="pic"
      >
        <el-input v-model="dialog.form.pic" />
      </el-form-item>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item
            label="年份"
            prop="year"
          >
            <el-input v-model="dialog.form.year" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="语言"
            prop="lang"
          >
            <el-input v-model="dialog.form.lang" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item
            label="地区"
            prop="area"
          >
            <el-input v-model="dialog.form.area" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item
        label="内容简介"
        prop="content"
        width="100"
      >
        <el-input
          v-model="dialog.form.content"
          :rows="3"
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
import {
  getArchive, addArchive, updateArchive, deleteArchive,
  getCategory,
  getTag, addArchiveTag, deleteArchiveTag
} from '@/apis/archive'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  total: 0,
  query: {
    limit: 20,
    page: 1,
    order: '-id',
    id: null,
    name: null,
    status: null,
    updateStart: null,
    updateEnd: null
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
  vodTypeList: [], // 分类的原始数据
  vodTypeDict: {}, // 分类的字典类型
  formTempSelectType: null, // 筛选选择的分类临时数据
  vodTagList: [], // 远程搜索标签的数据
  formTempSelectTag: null,
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

// 远程搜索标签名称
const handleRemoteTagList = () => {
  getTag({ name: dialog.value.formTempSelectTag, page: 1, limit: 20 }).then(result => {
    dialog.value.vodTagList = result.data
  })
}

const handleRemoteTagSelect = (value) => {
  dialog.value.formTempSelectTag = null
  addArchiveTag({ archiveTagId: value.id, archiveListId: dialog.value.form.id }).then(result => {
    const data = {
      id: result.data.id,
      ArchiveTag: value
    }
    dialog.value.form.Tags.push(data)
    ElMessage.info(result.message)
  })
}

const handleDeleteTagMap = (id, tags) => {
  deleteArchiveTag({ id }).then((result) => {
    ElMessage.warning(result)
    const index = tags.findIndex(tag => tag.id === id)
    if (index !== -1) {
      tags.splice(index, 1)
    }
  })
}

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

const handleDialogEditStatus = (row) => {
  const action = () => {
    updateArchive({
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

<style>
.el-table .el-table__cell {
  position: static
}
</style>
