<template>
  <div class="dashboard-user-container">
    <div class="chart" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
import moment from 'moment'
export default {
  data() {
    return {
      chart: null
    }
  },
  created() {
    this.loadData()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose()
      this.chart = null
    }
  },
  methods: {
    async loadData() {
      const today = moment(new Date()).format('YYYY-M-D')
      const yesterday = moment(new Date())
        .subtract(1, 'days')
        .format('YYYY-M-D')
      const tomorrow = moment(new Date()).add(1, 'days').format('YYYY-M-D')
      const yesterdayParams = {
        '@filter': `entity.getDate() >= datetime.get('${yesterday}') && entity.getDate() < datetime.get('${today}')`
      }
      const todayParams = {
        '@filter': `entity.getDate() >= datetime.get('${today}') && entity.getDate() < datetime.get('${tomorrow}')`
      }

      const { data } = await this.$api.get('/business/phases')

      const yesterdayRes = await this.$api.get('/business/dinings', {
        params: yesterdayParams
      })
      const todayRes = await this.$api.get('/business/dinings', {
        params: todayParams
      })

      this.initChart(getTotal(yesterdayRes.data), getTotal(todayRes.data))

      function getTotal(list) {
        return data.map((e) => {
          const result = { name: e.name }
          result.value = list.reduce(
            (acc, cur) => (e.id === cur.phase.id ? acc + 1 : acc),
            0
          )
          return result
        })
      }
    },
    initChart(yesterday, today) {
      this.chart = echarts.init(document.getElementsByClassName('chart')[0])

      this.chart.setOption({
        title: {
          text: '订餐情况',
          subtext: '昨天  |  今天',
          left: 'center'
        },
        label: {
          formatter: '{name|{b}}\n{value|{c} 份}',
          lineHeight: 24,
          rich: {
            value: {
              fontSize: 16,
              color: '#999'
            }
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c}份 ({d}%)'
        },
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
            name: '昨天',
            type: 'pie',
            radius: [30, 160],
            center: ['25%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: yesterday
          },
          {
            name: '今天',
            type: 'pie',
            radius: [30, 160],
            center: ['75%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: today
          }
        ]
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.dashboard-user-container {
  margin: 24px 0;
  display: flex;
}
.chart {
  width: 1200px;
  height: calc(100vh - 98px);
}
</style>
