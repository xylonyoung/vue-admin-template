<template>
  <div>
    <el-table :data="data" v-bind="mixedProps" v-on="events">
      <el-table-column type="selection" width="55" />

      <el-table-column
        v-for="(item, index) in configs"
        :key="index"
        :label="getLabel(item)"
        v-bind="item.props"
        v-on="item.events"
      >
        <template slot-scope="{ row }">
          <div v-if="item.component">
            <component :is="item.component" :row="row" />
          </div>
          <div v-else-if="dataType(item, 'array')">
            <el-tag
              v-for="(arrayItem, arrayIndex) in row[propertyName(item)]"
              :key="arrayIndex"
              type="info"
            >
              {{ arrayItem }}
            </el-tag>
          </div>
          <div v-else-if="dataType(item, 'boolean')">
            <el-tag v-if="row[propertyName(item)]" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </div>
          <div v-else-if="dataType(item, 'date')">
            {{ $dateFormat(getString(row, item)) }}
          </div>
          <div v-else-if="dataType(item, 'datetime')">
            {{ $dateFormat(getString(row, item)) }}
          </div>
          <div v-else-if="dataType(item, 'decimal')">
            {{ $numberFormat(getString(row, item)) }}
          </div>
          <div v-else-if="dataType(item, 'integer')">
            {{ getString(row, item) }}
          </div>
          <div v-else-if="dataType(item, 'ManyToOne')">
            {{ getString(row, item) }}
          </div>
          <div v-else-if="dataType(item, 'OneToOne')">
            {{ getString(row, item) }}
          </div>
          <div v-else-if="dataType(item, 'string')">
            {{ getString(row, item) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column v-if="!disableActions" label="操作" fixed="right">
        <template slot-scope="{ row }">
          <slot :row="row" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {
    data: { type: Array, default: () => [] },
    disableActions: { type: Boolean, default: false }
  },
  data() {
    return { defaultProps: { stripe: true } }
  },
  methods: {
    propertyName(item) {
      return item?.property ?? item
    },
    getLabel(item) {
      const name = this.propertyName(item)
      return this.entity[name]?.translation ?? name
    },
    dataType(item, type) {
      const name = this.propertyName(item)
      return this.entity[name]?.metadata?.type === type
    },
    getString(row, item) {
      const result = row[this.propertyName(item)]
      return result?.__toString ?? result
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
