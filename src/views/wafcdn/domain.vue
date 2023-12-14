<template>
  <!-- 数据展示框 -->
  <el-main class="ea-table">
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
    >
      <el-table-column
        label="域名"
        prop="domain"
        align="center"
      />
      <el-table-column
        label="端口(http)"
        prop="port"
        align="center"
      />
      <el-table-column
        label="端口(https)"
        prop="ssl.port"
        align="center"
      />
      <el-table-column
        label="源站"
        align="center"
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
            @click="handleDialogDelete(scope.$index)"
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
      :model="dialog.formTmp"
      :rules="dialog.formRule"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="域名设置">
          <el-form-item
            label="域名"
            prop="domain"
          >
            <el-input v-model="dialog.formTmp.domain" />
          </el-form-item>
          <el-form-item
            label="端口"
            prop="port"
          >
            <el-input-number v-model="dialog.formTmp.port" />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="回源管理">
          <el-form-item
            label="回源路径"
            prop="backend.url"
          >
            <el-input v-model="dialog.formTmp.backend.url" />
          </el-form-item>
          <el-form-item
            label="回源域名"
            prop="backend.host"
          >
            <el-input v-model="dialog.formTmp.backend.host" />
          </el-form-item>
          <el-form-item label="回源请求头">
            <template
              v-for="(value,index) in dialog.formTmp.backend.req_header"
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
                  icon="Minus"
                  circle
                  @click="dialog.formTmp.backend.req_header.splice(index,1)"
                />
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
            <el-button
              type="primary"
              icon="Plus"
              circle
              @click="dialog.formTmp.backend.req_header.push({name:'Name',value:'Value'})"
            />
          </el-form-item>
          <el-form-item label="回源返回头">
            <template
              v-for="(value,index) in dialog.formTmp.backend.resp_header"
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
                  icon="Minus"
                  circle
                  @click="dialog.formTmp.backend.resp_header.splice(index,1)"
                />
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
            <el-button
              type="primary"
              icon="Plus"
              circle
              @click="dialog.formTmp.backend.resp_header.push({name:'Name',value:'Value'})"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="SSL">
          <el-form-item
            label="SSL端口"
            prop="ssl.port"
          >
            <el-input-number v-model="dialog.formTmp.ssl.port" />
          </el-form-item>
          <el-row>
            <el-col :span="11">
              <el-form-item
                label="证书"
                prop="ssl.crt"
              >
                <el-input
                  v-model="dialog.formTmp.ssl.crt"
                  rows="15"
                  type="textarea"
                  placeholder="crt证书文件"
                />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                label="密钥"
                prop="ssl"
              >
                <el-input
                  v-model="dialog.formTmp.ssl.key"
                  placeholder="key私钥文件"
                  rows="15"
                  type="textarea"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="缓存配置">
          <el-form-item
            label="缓存路径"
            prop="cache.dir"
          >
            <el-input v-model="dialog.formTmp.cache.dir" />
          </el-form-item>
          <el-form-item label="缓存规则">
            <template
              v-for="(value,index) in dialog.formTmp.cache.rule"
              :key="index"
            >
              <el-col :span="11">
                <el-input
                  v-model="value.path"
                  placeholder="名"
                />
              </el-col>
              <el-col
                :span="2"
                style="text-align: center;"
              >
                <el-button
                  icon="Minus"
                  circle
                  @click="dialog.formTmp.cache.rule.splice(index,1)"
                />
              </el-col>
              <el-col
                :span="11"
              >
                <el-input
                  v-model="value.time"
                  placeholder="值(分钟)"
                />
              </el-col>
              <el-col
                :span="24"
                style="height: 5px;"
              />
            </template>
            <el-button
              type="primary"
              icon="Plus"
              circle
              @click="dialog.formTmp.cache.rule.push({path:'/example',time:1440})"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="安全配置">
          暂未开启
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
import { getDomain, putDomain } from '@/apis/wafcdn'
import { ElMessage, ElMessageBox } from 'element-plus'

const table = ref({
  data: []
})

const handleTableData = () => {
  getDomain().then((result) => {
    table.value.data = result
  })
}

const dialogRef = ref(null)

const dialog = ref({
  visible: false,
  title: 'dialog',
  form: {},
  formTmp: {},
  formRule: {},
  formAction: 'add' // add|edit
})

const handleDialogAdd = () => {
  dialog.value.title = '绑定新域名'
  dialog.value.visible = true
  dialog.value.formAction = 'add'
  dialog.value.form = {}
  dialog.value.formTmp = {
    domain: '',
    port: null,
    ssl: {
      port: null,
      crt: '',
      key: ''
    },
    backend: {
      url: '',
      host: '',
      req_header: [],
      resp_header: []
    },
    cache: {
      dir: '',
      rule: [
      ]
    }
  }
}

const handleDialogEdit = (row) => {
  dialog.value.title = '修改 ' + row.domain + ' 的配置'
  dialog.value.visible = true
  dialog.value.formAction = 'edit'
  dialog.value.form = row
  // 对对象进行copy
  dialog.value.formTmp = JSON.parse(JSON.stringify(row))
  dialog.value.formTmp.ssl.crt = atob(row.ssl.crt)
  dialog.value.formTmp.ssl.key = atob(row.ssl.key)
}

const handleSubmitForm = () => { // 提交数据
  dialogRef.value.validate((validate) => {
    if (validate) { // 判断表单是否验证通过。
      if (dialog.value.formAction === 'add') {
        dialog.value.formTmp.ssl.crt = btoa(dialog.value.formTmp.ssl.crt)
        dialog.value.formTmp.ssl.key = btoa(dialog.value.formTmp.ssl.key)
        table.value.data.push(dialog.value.formTmp)
        putDomain(table.value.data).then((result) => {
          dialog.value.visible = false
          ElMessage.info('新增完成')
        })
      } else if (dialog.value.formAction === 'edit') {
        dialog.value.formTmp.ssl.crt = btoa(dialog.value.formTmp.ssl.crt)
        dialog.value.formTmp.ssl.key = btoa(dialog.value.formTmp.ssl.key)
        for (const key in dialog.value.formTmp) {
          dialog.value.form[key] = dialog.value.formTmp[key]
        }
        putDomain(table.value.data).then((result) => {
          dialog.value.visible = false
          ElMessage.info('修改完成')
        })
      } else {
        ElMessage.error('提交错误')
      }
    } else {
      ElMessage.error('请输入正确的数据！')
    }
  })
}

const handleDialogDelete = (index) => {
  ElMessageBox.confirm(`请仔细确认是否删除数据[${index}]?`, '警告', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    table.value.data.splice(index, 1)
    putDomain(table.value.data).then((result) => {
      dialog.value.visible = false
      ElMessage.info('删除完成')
    })
  })
}

handleTableData()

</script>
