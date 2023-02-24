<template>
  <!--  -->
  <el-row style="margin-bottom: 12px;" :gutter="20">
    <el-col :span="12">
      <div ref="sharechart" class="chart"></div>
    </el-col>
    <el-col :span="12">
      <div ref="detailchart"  class="chart"></div>
    </el-col>

  </el-row>

  <el-row>
    <el-col :span="24">
      <div ref="trendchart"  class="chart"></div>
    </el-col>
  </el-row>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const sharechart = ref(null)
const detailchart = ref(null)
const trendchart = ref(null)

onMounted(() => {
  const mySharechart = echarts.init(sharechart.value)
  mySharechart.setOption({
    title: { text: '转码列表' },
    series: [{
      type: 'pie',
      data: [
        { value: 335, name: 'm3u8' },
        { value: 634, name: 'mp4' },
        { value: 434, name: 'mpd' }
      ]
    }
    ]
  })

  const myDetail = echarts.init(detailchart.value)
  myDetail.setOption({
    title: { text: '最高播放量' },
    tooltip: {},
    xAxis: { data: ['电视剧', '电影', '动漫', '短视频', '体育', '纪录片'] },
    yAxis: {},
    series: [{ name: '销量', type: 'bar', data: [5, 20, 36, 10, 10, 20] }]
  })

  const myTrendchart = echarts.init(trendchart.value)
  myTrendchart.setOption({
    title: { text: '7日新增趋势' },
    xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 175, 80, 256, 254], type: 'line' }]
  })

  window.onresize = function () {
    mySharechart.resize()
    myDetail.resize()
    myTrendchart.resize()
  }
})
</script>

<style scoped lang="scss">
.chart {
  min-height: 300px;
  background-color: #fff;
}

</style>
