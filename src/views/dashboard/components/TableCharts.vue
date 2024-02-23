<template>
  <el-row
    style="margin-bottom: 12px;"
    :gutter="20"
  >
    <el-col
      :sm="12"
      :xs="24"
    >
      <div
        ref="shareChart"
        class="chart"
      />
    </el-col>
    <el-col
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
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const shareChart = ref(null)
const detailChart = ref(null)
const trendChart = ref(null)

onMounted(() => {
  const myShareChart = echarts.init(shareChart.value)
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

  const myDetailChart = echarts.init(detailChart.value)
  myDetailChart.setOption({
    title: { text: '最高播放量' },
    legend: {},
    tooltip: {},
    xAxis: { data: ['电视剧', '电影', '动漫', '短视频', '体育', '纪录片'] },
    yAxis: {},
    series: [{ name: '销量', type: 'bar', data: [5, 20, 36, 10, 10, 20] }]
  })

  const myTrendChart = echarts.init(trendChart.value)
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

<style scoped lang="scss">
.chart {
  min-height: 300px;
  color: var(--ea-main-text-color);
  background-color: var(--ea-main-color);
}

</style>
