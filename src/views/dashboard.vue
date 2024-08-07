<template>
  <el-row
    :gutter="15"
    class="panel-group"
  >
    <PanelCard
      :xs="12"
      :sm="12"
      :lg="6"
      icon="FolderOpened"
      icon-color="#40c9c6"
      title="文件大小"
      :text="fileSizeFormat(panelGroup.fileSize ?? 0)"
    />

    <PanelCard
      :xs="12"
      :sm="12"
      :lg="6"
      icon="Files"
      icon-color="#36a3f7"
      title="文件数量"
      :text="panelGroup.fileTotal ?? 0"
    />

    <PanelCard
      :xs="12"
      :sm="12"
      :lg="6"
      icon="DocumentCopy"
      icon-color="#fac858"
      title="任务数量"
      :text="fileSizeFormat(panelGroup.taskTotal ?? 0)"
    />

    <PanelCard
      :xs="12"
      :sm="12"
      :lg="6"
      icon="SetUp"
      icon-color="#f4516c"
      title="编码器数量"
      :text="panelGroup.transcodeTotal ?? 0"
    />
  </el-row>

  <el-row
    :gutter="15"
  >
    <el-col
      style="margin-bottom: 12px;"
      :sm="12"
      :xs="24"
    >
      <div
        ref="shareChart"
        class="chart"
      />
    </el-col>
    <el-col
      style="margin-bottom: 12px;"
      :sm="12"
      :xs="24"
    >
      <div
        ref="detailChart"
        class="chart"
      />
    </el-col>
  </el-row>

  <el-row>
    <el-col :span="24">
      <div
        ref="trendChart"
        class="chart"
      />
    </el-col>
  </el-row>
</template>

<script setup>
// import 接口
import { getDashboardTotal } from '@/apis/dashboard'
import { fileSizeFormat } from '@/utils'
import PanelCard from '@/components/PanelCard.vue'
import { ref, onMounted } from 'vue'
import { init } from 'echarts'

const panelGroup = ref({})
getDashboardTotal().then((result) => {
  panelGroup.value = result
})

const shareChart = ref(null)
const detailChart = ref(null)
const trendChart = ref(null)

onMounted(() => {
  const myShareChart = init(shareChart.value)
  myShareChart.setOption({
    title: { text: '转码列表' },
    legend: {},
    tooltip: {},
    series: [{
      type: 'pie',
      data: [
        { value: 335, name: 'm3u8' },
        { value: 634, name: 'mp4' },
        { value: 434, name: 'mpd' }
      ]
    }]
  })

  const myDetailChart = init(detailChart.value)
  myDetailChart.setOption({
    title: { text: '最高播放量' },
    legend: {},
    tooltip: {},
    xAxis: { data: ['电视剧', '电影', '动漫', '短视频', '体育', '纪录片'] },
    yAxis: {},
    series: [{ name: '播放量', type: 'bar', data: [5, 20, 36, 10, 10, 20] }]
  })

  const myTrendChart = init(trendChart.value)
  myTrendChart.setOption({
    title: { text: '7日新增趋势' },
    legend: {},
    tooltip: {},
    xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 175, 80, 256, 254], type: 'line' }]
  })

  window.onresize = function () {
    myShareChart.resize()
    myDetailChart.resize()
    myTrendChart.resize()
  }
})

</script>

<style lang="scss" scoped>
.panel-group {
  margin-bottom: 5px;
}

.chart {
  min-height: 300px;
  color: var(--ea-main-text-color);
  background-color: var(--ea-main-color);
}

</style>
