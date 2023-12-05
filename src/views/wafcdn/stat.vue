<template>
  <el-select
    v-model="table.flushDelay"
  >
    <el-option
      :key="5"
      label="服务器状态刷新间隔: 5秒"
      :value="5"
    />
    <el-option
      :key="15"
      label="服务器状态刷新间隔: 15秒"
      :value="15"
    />
    <el-option
      :key="30"
      label="服务器状态刷新间隔: 30秒"
      :value="30"
    />
    <el-option
      :key="60"
      label="服务器状态刷新间隔: 60秒"
      :value="60"
    />
  </el-select>

  <el-row
    :gutter="40"
    class="panel-group"
  >
    <el-col
      :xs="24"
      :sm="8"
    >
      <div class="card-panel">
        <br>
        <el-progress
          type="circle"
          :percentage="table.cpu.percent"
        />
        <div class="text">
          CPU / {{ table.cpu.count }}
        </div>
        <br>
      </div>
    </el-col>
    <el-col
      :xs="24"
      :sm="8"
    >
      <div class="card-panel">
        <br>
        <el-progress
          type="circle"
          :percentage="table.memory.progress"
        >
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}%</span><br><br>
            <span class="percentage-label">{{ table.memory.used }}</span>
          </template>
        </el-progress>
        <div class="text">
          内存 / {{ table.memory.total }}
        </div>
        <br>
      </div>
    </el-col>
    <el-col
      :xs="24"
      :sm="8"
    >
      <div class="card-panel">
        <br>
        <el-progress
          type="circle"
          :percentage="table.disk.progress"
        >
          <template #default="{ percentage }">
            <span class="percentage-value">{{ percentage }}%</span><br><br>
            <span class="percentage-label">{{ table.disk.used }}</span>
          </template>
        </el-progress>
        <div class="text">
          硬盘 / {{ table.disk.total }}
        </div>
        <br>
      </div>
    </el-col>
  </el-row>

  <el-row
    :gutter="12"
    class="notifyCard"
  >
    <el-col :span="12">
      <el-card shadow="always">
        配置版本:
        <el-link type="info">
          {{ table.conf.time }}
        </el-link>
        &nbsp;-&nbsp;
        <el-tooltip
          :content="table.conf.version"
        >
          <el-link type="primary">
            {{ table.conf.version.substring(0, 12) }}
          </el-link>
        </el-tooltip>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="always">
        缓存文件: 今日 <el-link type="success">
          {{ table.file.today }}
        </el-link> /
        总计 <el-link type="primary">
          {{ table.file.total }}
        </el-link>
      </el-card>
    </el-col>
  </el-row>

  <!-- 带宽和硬盘读写 -->
  <el-row>
    <el-col :span="24">
      <div
        ref="netChart"
        class="netChart"
      />
    </el-col>
  </el-row>
</template>

<script setup>
import { stat } from '@/apis/wafcdn'
import * as echarts from 'echarts'
import { ref, onMounted, onUnmounted } from 'vue'
import { byteBPSFormat, dateFormat, fileSizeFormat } from '@/utils/index'

const table = ref({
  cpu: {
    percent: 0,
    count: 0
  },
  memory: {
    progress: 0,
    used: '',
    total: ''
  },
  disk: {
    progress: 0,
    used: '',
    total: ''
  },
  conf: {
    time: '',
    version: ''
  },
  file: {
    today: 0,
    total: 0
  },
  flushDelay: 15
})

let netEcharts = null
const netX = []
const netDataSend = []
const netDataRecv = []
const netChart = ref(null)
const netOption = {
  title: { text: '网络IO' },
  xAxis: { type: 'category', data: netX },
  yAxis: {
    type: 'value',
    axisLabel: {
      formatter: (value, index) => byteBPSFormat(value)
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
      data: netDataRecv,
      type: 'line',
      areaStyle: {}
    },
    {
      name: '发送',
      data: netDataSend,
      type: 'line',
      areaStyle: {}
    }
  ]
}

const handleReflushStat = () => {
  stat().then((result) => {
    // cpu
    table.value.cpu.percent = Math.round(result.cpu.percent)
    table.value.cpu.count = result.cpu.count
    // 内存
    table.value.memory.progress = Math.round(result.memory.used / result.memory.total * 100)
    table.value.memory.used = fileSizeFormat(result.memory.used)
    table.value.memory.total = fileSizeFormat(result.memory.total)
    // 硬盘
    table.value.disk.progress = Math.round(result.disk.used / result.disk.total * 100)
    table.value.disk.used = fileSizeFormat(result.disk.used)
    table.value.disk.total = fileSizeFormat(result.disk.total)
    // 配置
    table.value.conf.time = dateFormat('Y-m-d H:i:s', result.conf.time)
    table.value.conf.version = result.conf.version
    // 缓存文件
    table.value.file.today = result.file.today
    table.value.file.total = result.file.total
    // 设置网络折线图
    const t = new Date()
    netX.push(t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds())
    netDataSend.push(result.traffic.send)
    netDataRecv.push(result.traffic.recv)
    if (netX.length > 30) {
      netX.shift()
      netDataRecv.shift()
      netDataSend.shift()
    }
    netEcharts.setOption(netOption)
  })
}

onMounted(() => {
  netEcharts = echarts.init(netChart.value)
  netEcharts.hideLoading()

  window.onresize = function () {
    netEcharts.resize()
  }
})

handleReflushStat()

const intervalId = setInterval(handleReflushStat, table.value.flushDelay * 1000)

onUnmounted(() => {
  clearInterval(intervalId)
})

</script>

<style lang="scss" scoped>
.panel-group {
    .card-panel {
        margin: 10px 0;
        background: #fff;
        text-align: center;
        box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
        border-color: rgba(0, 0, 0, .05);

        .text {
            font-size: 16px;
            color: rgba(0, 0, 0, 0.45);
            margin-top: 10px;
        }
    }
}

.notifyCard {
    margin: 10px 0;
}

.netChart {
    margin: 10px 0;
    padding: 5px;
    min-height: 300px;
    background-color: #fff;
}
</style>
