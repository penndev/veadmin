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
        label="主机"
        prop="ip"
        width="160"
        align="center"
      />
      <el-table-column
        label="端口"
        prop="port"
        width="160"
        align="center"
      />
      <el-table-column
        prop="createdAt"
        align="center"
        label="创建日期"
        width="220"
      />

      <el-table-column
        fixed="right"
        label="操作"
        width="165"
      >
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="terminal.handleNew(scope.row)"
          >
            终端
          </el-button>
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
        label="主机IP"
        prop="ip"
      >
        <el-input v-model="dialog.form.ip" />
      </el-form-item>
      <el-form-item
        label="SSH端口"
        prop="port"
      >
        <el-input-number v-model="dialog.form.port" />
      </el-form-item>
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input v-model="dialog.form.username" />
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input v-model="dialog.form.password" />
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

  <!-- 终端展示框 -->
  <el-dialog
    v-model="terminal.visible"
    :title="terminal.title"
    width="800px"
    destroy-on-close
    close-on-press-escape
    center
    @close="terminal.handleClose"
    @open="terminal.handleOpen"
  >
    <template #header>
      <el-row>
        <span class="el-dialog__title">{{ terminal.title }}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <el-switch
          v-model="terminal.installVisible"
          active-text="取消安装"
          inactive-text="开启安装"
          inline-prompt
        />
        &nbsp;&nbsp;
        <el-switch
          v-model="terminal.portVisible"
          active-text="取消端口"
          inactive-text="开启端口"
          inline-prompt
        />
      </el-row>
    </template>
    <!-- 安装软件 -->
    <el-form
      v-if="terminal.installVisible"
      label-position="left"
      size="small"
      inline
      label-width="100px"
    >
      <el-form-item label="API密钥">
        <el-input v-model="terminal.form.apikey" />
      </el-form-item>
      <el-form-item label="API端口">
        <el-input v-model="terminal.form.apiport" />
      </el-form-item>
      <el-form-item label="缓存目录">
        <el-input v-model="terminal.form.cachedir" />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="terminal.handleInstall"
        >
          运行安装
        </el-button>
      </el-form-item>
      <br><br>
    </el-form>
    <!-- 开放端口 -->
    <el-form
      v-if="terminal.portVisible"
      label-position="left"
      size="small"
      inline
      label-width="100px"
    >
      <el-form-item label="端口">
        <el-input />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">
          放开
        </el-button>
        <el-button type="primary">
          查看
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 终端窗口 -->
    <div ref="terminalRef" />
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

import { Terminal } from 'xterm'
import 'xterm/css/xterm.css'

// import api
import { getControlHost, postControlHost, putControlHost, deleteControlHost, installControlHost } from '@/apis/wafcdn'
import { ElMessage, ElMessageBox } from 'element-plus'

// ws 请求地址配置
import { authStoe } from '@/stores'
const wsOrigin = new URL(import.meta.env.VE_API_URL, window.location.href).origin.replace('http', 'ws').replace('https', 'wss')
const wsssh = `${wsOrigin}/ssh?token=${authStoe().token}`

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
    getControlHost(table.value.query).then((result) => {
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
    ip: [
      { required: true, message: '主机必须填写正确的IP', trigger: 'blur' }
    ],
    port: [
      { required: true, message: '端口', trigger: 'blur' }
    ],
    username: [
      { required: true, message: '用户', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '密码', trigger: 'blur' }
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
          postControlHost(dialog.value.form).then((result) => {
            dialog.value.visible = false
            ElMessage.info(result)
            table.value.handleTableData()
          })
        } else if (dialog.value.formAction === 'edit') {
          putControlHost(dialog.value.form).then((result) => {
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
      deleteControlHost({ id }).then((result) => {
        ElMessage.warning(result)
        table.value.handleTableData()
      })
    })
  }
})

const terminalRef = ref(null)

const terminal = ref({
  title: '终端',
  visible: false,
  ws: {},
  wsurl: '',
  terminal: {},
  handleNew: (row) => {
    terminal.value.form = row
    terminal.value.visible = true
    terminal.value.wsurl = wsssh + '&hid=' + row.id
  },
  handleOpen: () => {
    terminal.value.visible = true
    const term = new Terminal()
    term.open(terminalRef.value)
    term.write('正在连接控制器 \r\n')
    const ws = new WebSocket(terminal.value.wsurl)
    ws.onopen = (event) => {
      term.write('控制器已经建立连接 \r\n')
    }
    ws.onmessage = (event) => {
      term.write(event.data)
    }
    term.onData((data) => {
      ws.send(data)
    })
    terminal.value.ws = ws
  },
  handleClose: () => {
    terminal.value.ws.close()
  },
  installVisible: false,
  form: {},
  handleInstall: () => {
    installControlHost({
      id: terminal.value.form.id,
      apikey: terminal.value.form.apikey,
      apiport: terminal.value.form.apiport,
      cachedir: terminal.value.form.cachedir
    }).then((result) => {
      console.log(result)
    })
  },
  portVisible: false
})

table.value.handleTableData()

</script>
