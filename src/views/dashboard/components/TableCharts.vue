<template>
  <el-row style="padding-top: 12px">
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
    title: { text: '销售渠道' },
    series: [{
      type: 'pie',
      data: [
        { value: 335, name: '门店销售' },
        { value: 634, name: '在线商城' },
        { value: 434, name: '上门推销' },
        { value: 434, name: '代理销售' },
        { value: 600, name: '回头客户' }
      ]
    }
    ]
  })
  mySharechart.resize()

  const myDetail = echarts.init(detailchart.value)
  myDetail.setOption({
    title: { text: '销量明细' },
    tooltip: {},
    xAxis: { data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'] },
    yAxis: {},
    series: [{ name: '销量', type: 'bar', data: [5, 20, 36, 10, 10, 20] }]
  })
  myDetail.resize()

  const myTrendchart = echarts.init(trendchart.value)
  myTrendchart.setOption({
    title: { text: '7日销售趋势' },
    xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
    yAxis: { type: 'value' },
    series: [{ data: [120, 200, 150, 175, 80, 256, 254], type: 'line' }]
  })
  myTrendchart.resize()
})
</script>

<style scoped lang="scss">
.chart {
  min-height: 300px;
}
</style>
