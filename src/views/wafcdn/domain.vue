<template>
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
      style="width: 100%"
      @sort-change="handleSortChange"
    >
      <el-table-column
        label="域名"
        prop="domain"
        align="center"
        width="200"
      />
      <el-table-column
        label="端口(http)"
        prop="port"
        align="center"
        width="120"
      />
      <el-table-column
        label="端口(https)"
        prop="ssl.port"
        align="center"
        width="120"
      />
      <el-table-column
        label="源站"
        align="center"
        width="300"
      >
        <template #default="scope">
          <el-text type="info">
            回源地址:
          </el-text> <el-link type="primary">
            {{ scope.row.backend.url }}
          </el-link> <br>
          <el-text type="info">
            回源域名:
          </el-text> <el-link type="warning">
            {{ scope.row.backend.host }}
          </el-link>
        </template>
      </el-table-column>
      <el-table-column
        label="缓存目录"
        prop="cache.dir"
        align="center"
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
      <el-tabs type="border-card">
        <el-tab-pane label="域名设置">
          <el-form-item
            label="域名"
            prop="domain"
          >
            <el-input v-model="dialog.form.domain" />
          </el-form-item>
          <el-form-item
            label="端口"
            prop="port"
          >
            <el-input-number v-model="dialog.form.port" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="回源管理">
          <el-form-item
            label="回源路径"
            prop="backend.url"
          >
            <el-input v-model="dialog.form.backend.url" />
          </el-form-item>
          <el-form-item
            label="回源域名"
            prop="backend.url"
          >
            <el-input v-model="dialog.form.backend.url" />
          </el-form-item>
          <el-form-item label="回源请求头">
            <template
              v-for="(value,index) in dialog.form.backend.req_header"
              :key="index"
            >
              <el-col :span="11">
                <el-input
                  v-model="value.name"
                  placeholder="名"
                />
              </el-col>
              <el-col
                :span="2"
                style="text-align: center;"
              >
                <el-button
                  v-if="index==0"
                  type="primary"
                  icon="Plus"
                  circle
                  @click="dialog.form.backend.req_header.push({name:'',value:''})"
                />
                <span v-else>-</span>
              </el-col>
              <el-col
                :span="11"
              >
                <el-input
                  v-model="value.value"
                  placeholder="值"
                />
              </el-col>
              <el-col
                :span="24"
                style="height: 5px;"
              />
            </template>
          </el-form-item>
          <el-form-item label="回源返回头">
            <template
              v-for="(value,index) in dialog.form.backend.resp_header"
              :key="index"
            >
              <el-col :span="11">
                <el-input
                  v-model="value.name"
                  placeholder="名"
                />
              </el-col>
              <el-col
                :span="2"
                style="text-align: center;"
              >
                <el-button
                  v-if="index==0"
                  type="primary"
                  icon="Plus"
                  circle
                  @click="dialog.form.backend.resp_header.push({name:'',value:''})"
                />
                <span v-else>-</span>
              </el-col>
              <el-col
                :span="11"
              >
                <el-input
                  v-model="value.value"
                  placeholder="值"
                />
              </el-col>
              <el-col
                :span="24"
                style="height: 5px;"
              />
            </template>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="SSL">
          <el-form-item
            label="回源路径"
            prop="ssl.port"
          >
            <el-input v-model="dialog.form.ssl.port" />
          </el-form-item>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="证书"
                prop="ssl.crt"
              >
                <el-input
                  v-model="dialog.form.ssl.crt"
                  rows="15"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="密钥"
                prop="ssl.key"
              >
                <el-input
                  v-model="dialog.form.ssl.key"
                  rows="15"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="缓存配置">
          Task
        </el-tab-pane>
        <el-tab-pane label="安全配置">
          Task
        </el-tab-pane>
      </el-tabs>
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
import { getDomain, postExample, putExample, deleteExample } from '@/apis/wafcdn'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  data: []
})

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
  getDomain().then((result) => {
    table.value.data = result
  })
}

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
  dialog.value.title = '绑定新域名'
  dialog.value.visible = true
  dialog.value.formAction = 'add'
  dialog.value.form = {}
}

const handleDialogEdit = (row) => {
  dialog.value.title = '修改 ' + row.domain + ' 的配置'
  dialog.value.visible = true
  dialog.value.formAction = 'edit'
  row.ssl.crt = atob(row.ssl.crt)
  row.ssl.key = atob(row.ssl.key)
  dialog.value.form = row
}

// 新增编辑数据
const dialogRef = ref(null)

const handleSubmitForm = () => { // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      if (dialog.value.formAction === 'add') {
        postExample(dialog.value.form).then((result) => {
          dialog.value.visible = false
          ElMessage.info(result)
          handleTableData()
        })
      } else if (dialog.value.formAction === 'edit') {
        putExample(dialog.value.form).then((result) => {
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

const handleDialogDelete = (id) => {
  ElMessageBox.confirm(`请仔细确认是否删除数据[${id}]?`, '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteExample({ id }).then((result) => {
      ElMessage.warning(result)
      handleTableData()
    })
  })
}

handleTableData()

</script>
