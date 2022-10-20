<template>
    <div ref="main">
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const main = ref(null)

onMounted(() => {
  const myChart = echarts.init(main.value)

  myChart.resize()
  myChart.setOption({
    title: {
      text: '销量详情'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [
      {
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }
    ]
  })
})
</script>

<style scoped lang="scss">
div{
    width: 100%;
    min-height: 400px;
    padding: 15px;
}
</style>
