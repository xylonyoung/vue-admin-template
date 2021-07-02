<template>
  <div>
    <!-- <div class="today" />
    <div class="yesterday" /> -->
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    loadData() {
      // this.$api.get()
    },
    initChart() {
      this.chart = echarts.init(document.getElementsByClassName('today')[0])

      this.chart.setOption({
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '面积模式',
            type: 'pie',
            radius: [50, 250],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: 40, name: 'rose 1' },
              { value: 38, name: 'rose 2' },
              { value: 32, name: 'rose 3' },
              { value: 30, name: 'rose 4' },
              { value: 28, name: 'rose 5' },
              { value: 26, name: 'rose 6' },
              { value: 22, name: 'rose 7' },
              { value: 18, name: 'rose 8' }
            ]
          }
        ]
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.today {
  width: 1200px;
  height: 600px;
}
</style>
