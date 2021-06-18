<template>
  <div>
    <el-table :data="data" v-bind="tableProps" v-on="events">
      <el-table-column type="selection" width="55" />
      <el-table-column label="日期" width="120">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="address" label="地址" show-overflow-tooltip />
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    data: { type: Array, default: () => [] },
    props: { type: Object, default: () => ({}) },
    events: { type: Object, default: () => ({}) }
  },
  data() {
    return { defaultProps: { stripe: true } }
  },
  computed: {
    tableProps() {
      return { ...this.defaultProps, ...this.props }
    }
  },
  methods: {}
}
</script>
<style lang='scss' scoped>
</style>
