<template>
  <div>
    <el-table :data="value" v-bind="configProps" v-on="events">
      <slot name="selection" />

      <el-table-column
        v-for="(item, index) in config"
        :key="index"
        :label="getLabel(item)"
        v-bind="item.props"
        v-on="item.events"
      >
        <template slot-scope="{ row, $index }">
          <div v-if="item.component">
            <component
              :is="item.component"
              v-if="showComponent"
              v-model="value[$index][propertyName(item)]"
              :row.sync="value[$index]"
              :property="item.property"
              :entity="entity"
              :index="$index"
            />
          </div>

          <div v-else-if="checkDataType(item, 'image')">
            <component
              :is="ImageRender()"
              v-model="value[$index][propertyName(item)]"
            />
          </div>
          <div v-else-if="checkDataType(item, 'array')">
            <el-tag
              v-for="(arrayItem, arrayIndex) in row[propertyName(item)]"
              :key="arrayIndex"
              type="info"
            >
              {{ arrayItem }}
            </el-tag>
          </div>
          <div v-else-if="checkDataType(item, 'boolean')">
            <el-tag v-if="row[propertyName(item)]" type="success">是</el-tag>
            <el-tag v-else type="danger">否</el-tag>
          </div>
          <div v-else-if="checkDataType(item, 'time')">
            {{ $dateFormat(getString(row, item), 'H:m') }}
          </div>
          <div v-else-if="checkDataType(item, 'date')">
            {{ $dateFormat(getString(row, item), 'YYYY/M/D') }}
          </div>
          <div v-else-if="checkDataType(item, 'datetime')">
            {{ $dateFormat(getString(row, item)) }}
          </div>
          <div v-else>
            {{ getString(row, item) }}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="!disableActions"
        label="操作"
        fixed="right"
        :width="actionsWidth"
      >
        <div ref="actions" slot-scope="{ row }">
          <slot name="actions" :row="row" />
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import mixin from '../Mixin'
import ImageRender from './ImageRender'
export default {
  mixins: [mixin],
  props: {
    value: { type: Array, default: () => [] },
    disableActions: { type: Boolean, default: false }
  },
  data() {
    return {
      defaultProps: { stripe: true },
      actionsWidth: ''
    }
  },
  watch: {
    value() {
      this.resetComponent()
    }
  },
  updated() {
    this.calculateActionsWidth()
  },
  methods: {
    ImageRender,
    calculateActionsWidth() {
      const refs = { ...this.$refs.actions?.children?.[0]?.children }
      const keys = Object.keys(refs)
      if (keys.length === 0) return

      const defaultPadding = keys.length === 0 ? 50 : 20
      const result = keys.reduce((acc, cur, index) => {
        // set margin-left 10
        if (index) {
          return acc + refs[cur].offsetWidth + 10
        } else {
          return acc + refs[cur].offsetWidth
        }
      }, defaultPadding)
      this.actionsWidth = result + 'px'
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
