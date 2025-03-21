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
  <el-drawer
    v-model="dialog.visible"
    :title="dialog.title"
    :close-on-click-modal="false"
    destroy-on-close
    size="80%"
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
            label="站点类型"
            prop="type"
          >
            <el-select
              v-model="dialog.formTmp.type"
              placeholder="站点类型"
            >
              <el-option
                key="proxy"
                label="反向代理"
                value="proxy"
              />
            </el-select>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="安全防护">
          <el-form-item
            label="开启访问限制"
            prop="security.limit.status"
          >
            <el-switch
              v-model="dialog.formTmp.security.limit.status"
              inline-prompt
              active-icon="Check"
              inactive-icon="Close"
            />
          </el-form-item>
          <el-card
            v-if="dialog.formTmp.security.limit.status"
            shadow="always"
          >
            <el-form-item
              label="流量限速 k/s"
              prop="security.limit.rate"
            >
              <el-input-number v-model="dialog.formTmp.security.limit.rate" />
            </el-form-item>
            <el-form-item
              label="请求速率"
              prop="security.limit"
            >
              <el-card shadow="always">
                在<el-input-number
                  v-model="dialog.formTmp.security.limit.seconds"
                  size="small"
                />秒
                最多请求<el-input-number
                  v-model="dialog.formTmp.security.limit.queries"
                  size="small"
                />次
              </el-card>
            </el-form-item>
          </el-card>
          <br>
          <el-form-item
            label="开启接口验签"
            prop="security.sign.status"
          >
            <el-switch
              v-model="dialog.formTmp.security.sign.status"
              inline-prompt
              active-icon="Check"
              inactive-icon="Close"
            />
          </el-form-item>
          <el-card
            v-if="dialog.formTmp.security.sign.status"
            shadow="always"
          >
            <el-form-item
              label="加密密钥"
              prop="security.sign.key"
            >
              <el-input v-model="dialog.formTmp.security.sign.key" />
            </el-form-item>
            <el-form-item
              label="加密方法"
              prop="security.sign.method"
            >
              <el-select
                v-model="dialog.formTmp.security.sign.method"
                placeholder="加密方法"
              >
                <el-option
                  key="HMAC_MD5"
                  label="HMAC_MD5算法"
                  value="HMAC_MD5"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="过期时间/参数名"
              prop="security.sign.expire_args"
            >
              <el-input v-model="dialog.formTmp.security.sign.expire_args" />
            </el-form-item>
            <el-form-item
              label="签名/参数名"
              prop="security.sign.sign_args"
            >
              <el-input v-model="dialog.formTmp.security.sign.sign_args" />
            </el-form-item>
          </el-card>
        </el-tab-pane>

        <el-tab-pane label="返回头">
          <el-row
            v-for="(value,index) in dialog.formTmp.header"
            :key="index"
            :gutter="10"
            style="margin: 12px auto;"
          >
            <el-col :span="11">
              <el-input
                v-model="value.name"
                placeholder="名"
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
              :span="2"
              style="text-align: center;"
            >
              <el-button
                icon="Delete"
                type="danger"
                circle
                @click="dialog.formTmp.header.splice(index,1)"
              />
            </el-col>
          </el-row>
          <el-button
            type="primary"
            icon="Plus"
            circle
            @click="dialog.formTmp.header.push({name:null,value:null})"
          />
        </el-tab-pane>
        <!-- 反向代理配置 -->
        <el-tab-pane
          v-if="dialog.formTmp.type === 'proxy'"
          label="反向代理"
        >
          <br>
          <!-- 回源设置 -->
          <el-card
            shadow="always"
          >
            <template #header>
              <div class="card-header">
                <span>回源设置</span>
              </div>
            </template>
            <el-form-item
              label="主机"
              prop="proxy.server"
            >
              <el-input v-model="dialog.formTmp.proxy.server" />
            </el-form-item>
            <el-form-item
              label="Host"
              prop="proxy.host"
            >
              <el-input v-model="dialog.formTmp.proxy.host" />
            </el-form-item>
            <div class="card-header">
              <span>回源请求头</span>
            </div>
            <el-row
              v-for="(value,index) in dialog.formTmp.proxy.header"
              :key="index"
              :gutter="10"
            >
              <el-col :span="11">
                <el-input
                  v-model="value.name"
                  placeholder="名"
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
                :span="2"
                style="text-align: center;"
              >
                <el-button
                  type="danger"
                  icon="Delete"
                  circle
                  @click="dialog.formTmp.proxy.header.splice(index,1)"
                />
              </el-col>
              <el-col
                :span="24"
                style="height: 5px;"
              />
            </el-row>
            <el-button
              type="primary"
              icon="Plus"
              circle
              @click="dialog.formTmp.proxy.header.push({name:null,value:null})"
            />
          </el-card>

          <br>
          <el-card
            shadow="always"
          >
            <template #header>
              <div class="card-header">
                <span>连接池</span>
              </div>
            </template>
            <el-form-item
              label="保活时间"
              prop="proxy.keepalive_timeout"
            >
              <el-input v-model="dialog.formTmp.proxy.keepalive_timeout" />
            </el-form-item>
            <el-form-item
              label="保活数量"
              prop="proxy.keepalive_requests"
            >
              <el-input v-model="dialog.formTmp.proxy.keepalive_requests" />
            </el-form-item>
          </el-card>

          <br>
          <el-card
            shadow="always"
          >
            <template #header>
              <div class="card-header">
                <span>缓存设置</span>
              </div>
            </template>

            <el-row
              v-for="(value,index) in dialog.formTmp.proxy.cache"
              :key="index"
              style="margin: 5px auto;"
              :gutter="10"
            >
              <el-col :span="7">
                <el-input
                  v-model="value.ruth"
                  placeholder="路径/regex"
                />
              </el-col>
              <el-col :span="2">
                <el-switch
                  v-model="value.args"
                  inline-prompt
                  style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                  active-text="忽略GET参数"
                  inactive-text="保留GET参数"
                />
              </el-col>
              <el-col :span="3">
                <el-input-number
                  v-model="value.time"
                  :controls="false"
                  placeholder="时间/s"
                />
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="value.Method"
                  multiple
                  placeholder="请求方法"
                >
                  <el-option
                    key="GET"
                    label="GET"
                    value="GET"
                  />
                  <el-option
                    key="POST"
                    label="POST"
                    value="POST"
                  />
                  <el-option
                    key="PUT"
                    label="PUT"
                    value="PUT"
                  />
                  <el-option
                    key="DELETE"
                    label="DELETE"
                    value="DELETE"
                  />
                  <el-option
                    key="PATCH"
                    label="PATCH"
                    value="PATCH"
                  />
                  <el-option
                    key="OPTIONS"
                    label="OPTIONS"
                    value="OPTIONS"
                  />
                  <el-option
                    key="HEAD"
                    label="HEAD"
                    value="HEAD"
                  />
                </el-select>
              </el-col>
              <el-col :span="5">
                <el-select
                  v-model="value.status"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  :reserve-keyword="false"
                  placeholder="状态码"
                >
                  <el-option
                    key="200"
                    label="200"
                    :value="200"
                  />
                </el-select>
              </el-col>
              <el-col
                :span="2"
                style="text-align: center;"
              >
                <el-button
                  type="danger"
                  icon="Delete"
                  circle
                  @click="dialog.formTmp.proxy.cache.splice(index,1)"
                />
              </el-col>
              <el-divider />
            </el-row>

            <el-button
              type="primary"
              icon="Plus"
              circle
              @click="dialog.formTmp.proxy.cache.push({ruth:null,args: true, time:null, method:[], status:[]})"
            />
          </el-card>
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
  </el-drawer>
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
    table.value.data = result instanceof Array ? result : []
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
    header: [],
    type: 'proxy',
    proxy: {
      service: '',
      host: '',
      keepalive_timeout: 0,
      keepalive_requests: 0,
      header: [],
      cache: []
    },
    security: {
      limit: {
        status: false,
        rate: 0,
        queries: 0,
        seconds: 0
      },
      sign: {
        status: false,
        method: '',
        key: '',
        expire_args: '',
        sign_args: ''
      }
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
        // table.value.data.push(dialog.value.formTmp)
        putDomain(table.value.data).then((result) => {
          dialog.value.visible = false
          ElMessage.info('新增完成')
          // 刷新是正解
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
