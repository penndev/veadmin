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
  <el-main class="ea-table">
    <!-- 数据操作按钮 -->
    <el-button
      :icon="table.selectStat? 'SemiSelect':'Select'"
      @click="(table.selectStat = !table.selectStat)?'':tableRef.clearSelection()"
    />
    <el-button
      v-if="table.selectStat"
      @click="table.handleInvertSelection"
    >
      反选
    </el-button>
    <el-button
      type="primary"
      icon="Plus"
      @click="dialog.handleDialogAdd"
    >
      新增
    </el-button>

    <el-button
      type="primary"
      icon="Refresh"
      @click="table.handleConfigPush"
    >
      推送配置
    </el-button>
    <!-- 数据table -->
    <el-table
      ref="tableRef"
      :data="table.data"
      @sort-change="table.handleSortChange"
    >
      <el-table-column
        v-if="table.selectStat"
        type="selection"
        width="50"
      />
      <el-table-column
        label="ID"
        prop="id"
        width="70"
        sortable="custom"
      />
      <el-table-column
        label="主机"
        prop="ip"
        width="150"
        align="center"
      />
      <el-table-column
        label="端口"
        prop="port"
        width="60"
        align="center"
      />
      <el-table-column
        align="center"
        label="带宽:下行/上行"
        width="220"
      >
        <template #default="scope">
          <el-text v-if="scope.row.stat">
            {{ scope.row.stat.netsend + "/" + scope.row.stat.netrecv }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="缓存文件:今日/总计"
        width="220"
      >
        <template #default="scope">
          <el-text v-if="scope.row.stat">
            {{ scope.row.stat.file.today + "/" + scope.row.stat.file.total }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="配置"
        width="220"
      >
        <template #default="scope">
          <el-text
            v-if="scope.row.stat"
            line-clamp="2"
          >
            {{ scope.row.stat.conf.time }} <br> {{ scope.row.stat.conf.version }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="状态cpu/memory"
        width="220"
      >
        <template #default="scope">
          <el-text v-if="scope.row.stat">
            {{ scope.row.stat.cpu }}% / {{ scope.row.stat.memory }}%
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        align="center"
        label="硬盘"
        width="220"
      >
        <template #default="scope">
          <el-text v-if="scope.row.stat">
            {{ scope.row.stat.disk.used }} / {{ scope.row.stat.disk.total }}
          </el-text>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
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
            @click="chart.handleNew(scope.row)"
          >
            监控
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
    <el-text>
      创建时间: <el-link type="info">
        {{ new Date(dialog.form.createdAt).toLocaleString() }}
      </el-link>
    </el-text>
    <el-text>
      上次更新: <el-link type="info">
        {{ new Date(dialog.form.updatedAt).toLocaleString() }}
      </el-link>
    </el-text>
    <br><br>
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
    width="80%"
    destroy-on-close
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :draggable="true"
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
          active-text="关闭工具"
          inactive-text="开启工具"
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
      v-if="terminal.installVisible"
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
    <div
      ref="terminalRef"
      v-loading="terminal.load"
    />
  </el-dialog>

  <el-dialog
    v-model="chart.visible"
    :title="chart.title"
    fullscreen
    @open="chart.handleOpen"
  >
    <template #header>
      <el-row>
        <span class="el-dialog__title">{{ chart.title }}</span>
        <el-date-picker
          v-model="chart.date"
          type="datetimerange"
          start-placeholder="选择开始时间"
          end-placeholder="选择结束时间"
          style="flex-grow: inherit;margin-left: 15px;"
          @change="chart.update"
        />
      </el-row>
    </template>

    <div
      ref="netChart"
      class="chart"
      style="height: 280px;"
    />
    <div
      ref="cpuChart"
      class="chart"
      style="height: 230px;"
    />
    <div
      ref="memoryChart"
      class="chart"
      style="height: 230px;"
    />
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'

import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import 'xterm/css/xterm.css'

// import api
import { getControlHost, postControlHost, putControlHost, deleteControlHost, installControlHost, pushControlHost, monitorControlHost } from '@/apis/wafcdn'
import { ElMessage, ElMessageBox } from 'element-plus'

// ws 请求地址配置
import { authStore } from '@/stores'
import { byteBPSFormat, dateFormat, fileSizeFormat } from '@/utils'

import * as echarts from 'echarts'

const wsUrl = new URL(import.meta.env.VE_API_URL, window.location.href).origin.replace('http', 'ws').replace('https', 'wss')
const wsssh = `${wsUrl}/ssh?token=${authStore().token}`
const wsmonitor = `${wsUrl}/monitor?token=${authStore().token}`

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
  },
  handleNewStat: () => {
    const ws = new WebSocket(wsmonitor)
    ws.onmessage = (event) => {
      const row = JSON.parse(event.data)
      row.conf.time = dateFormat('Y-m-d H:i:s', row.conf.time)
      row.disk.used = fileSizeFormat(row.disk.used)
      row.disk.total = fileSizeFormat(row.disk.total)
      row.netsend = byteBPSFormat(row.netsend)
      row.netrecv = byteBPSFormat(row.netrecv)
      // console.log(row)
      for (const element of table.value.data) {
        if (element.host === row.ip) {
          element.stat = row
          break
        }
      }
    }
  },
  handleConfigPush: () => {
    const rows = tableRef.value.getSelectionRows()
    ElMessageBox.confirm(rows.length ? '请确认是否推送仅选中?' : '请确认是否全部推送?', '推送配置',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      const ids = []
      for (const row of rows) {
        ids.push(row.id)
      }
      pushControlHost({ ids }).then((result) => {
        ElMessage.info(result)
      })
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
  load: true,
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
    const term = new Terminal({
      fontSize: 14
    })
    const termFit = new FitAddon()
    term.loadAddon(termFit)
    term.open(terminalRef.value)
    const termFitInit = () => {
      termFit.fit()
      console.log()
      ws.send(JSON.stringify({
        action: 'setWindow',
        ...termFit.proposeDimensions()
      }))
    }
    window.onresize = termFitInit
    const ws = new WebSocket(terminal.value.wsurl)
    ws.onopen = (event) => {
      terminal.value.load = false
      termFitInit()
    }
    ws.onmessage = (event) => {
      term.write(event.data)
    }
    ws.onerror = (event) => {
      ElMessage.warning('WebSocket发生错误:' + event)
    }
    ws.onclose = (event) => {
      ElMessage.info('终端 已关闭')
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
      ElMessage.success(result.message)
      terminal.value.ws.send(result.command)
    })
  }
})

const netChart = ref(null)
const netEchartX = []
const netEchartRecv = []
const netEchartSend = []
const netEchartOption = {
  title: { text: '网络IO' },
  xAxis: { type: 'category', data: netEchartX },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (value) => byteBPSFormat(value)
    }
  },
  tooltip: {
    trigger: 'axis', // 触发类型为坐标轴
    axisPointer: { // 坐标轴指示器配置
      type: 'cross' // 十字准星指示器
    },
    valueFormatter: (value) => byteBPSFormat(value)
  },
  series: [
    {
      name: '接收',
      data: netEchartRecv,
      type: 'line',
      areaStyle: {}
    },
    {
      name: '发送',
      data: netEchartSend,
      type: 'line',
      areaStyle: {}
    }
  ]
}

const cpuChart = ref(null)
const cpuChartCpuLimit = []
const cpuEchartOption = {
  title: { text: 'CPU' },
  xAxis: { type: 'category', data: netEchartX },
  yAxis: { type: 'value' },
  tooltip: {
    trigger: 'axis', // 触发类型为坐标轴
    axisPointer: { // 坐标轴指示器配置
      type: 'cross' // 十字准星指示器
    }
  },
  series: [
    {
      name: '用量',
      data: cpuChartCpuLimit,
      type: 'line'
    }
  ]
}

const memoryChart = ref(null)
const memoryChartLimit = []
const memoryEchartOption = {
  title: { text: '内存' },
  xAxis: { type: 'category', data: netEchartX },
  yAxis: { type: 'value' },
  tooltip: {
    trigger: 'axis', // 触发类型为坐标轴
    axisPointer: { // 坐标轴指示器配置
      type: 'cross' // 十字准星指示器
    }
  },
  series: [
    {
      name: '用量',
      data: memoryChartLimit,
      type: 'line'
    }
  ]
}

const chart = ref({
  title: '监控面板',
  visible: false,
  date: [], // 时间范围
  netEchart: null,
  cpuEchart: null,
  memoryEchart: null,
  update: () => {
    monitorControlHost({
      start: Math.floor(chart.value.date[0]?.getTime() / 1000),
      end: Math.floor(chart.value.date[1]?.getTime() / 1000)
    }).then((result) => {
      for (const row of result.data) {
        netEchartX.unshift(dateFormat('Y-m-d H:i:s', row.timestamp))
        netEchartRecv.unshift(row.netrecv)
        netEchartRecv.unshift(row.netsend)
        cpuChartCpuLimit.unshift(row.cpu)
        memoryChartLimit.unshift(row.memory)
      }
      chart.value.netEchart.setOption(netEchartOption)
      chart.value.cpuEchart.setOption(cpuEchartOption)
      chart.value.memoryEchart.setOption(memoryEchartOption)
    })
  },
  handleNew: (row) => {
    chart.value.visible = true
  },
  handleOpen: () => {
    if (chart.value.netEchart == null) {
      chart.value.netEchart = echarts.init(netChart.value)
    }
    if (chart.value.cpuEchart == null) {
      chart.value.cpuEchart = echarts.init(cpuChart.value)
    }
    if (chart.value.memoryEchart == null) {
      chart.value.memoryEchart = echarts.init(memoryChart.value)
    }
    chart.value.update()
  }
})

window.onresize = function () {
  if (chart.value.netEchart != null) {
    chart.value.netEchart.resize()
  }
  if (chart.value.cpuEchart != null) {
    chart.value.cpuEchart.resize()
  }
  if (chart.value.memoryEchart != null) {
    chart.value.memoryEchart.resize()
  }
}

table.value.handleTableData()
table.value.handleNewStat()

</script>
