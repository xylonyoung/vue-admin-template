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
              v-model="value[$index][propertyName(item)]"
              :row.sync="value[$index]"
              :property="item.property"
              :entity="entity"
            />
          </div>

          <div v-else-if="dataType(item, 'constant')">
            {{ getConstant(row, item) }}
          </div>
          <div v-else-if="dataType(item, 'image')">
            <el-image
              style="
                width: 64px;
                height: 64px;
                border: 3px white solid;
                boxshadow: 1px 1px 5px #ccc;
              "
              :src="imageUrl(row[propertyName(item)])"
              :preview-src-list="imageList(row[propertyName(item)])"
            />
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
          <div v-else-if="dataType(item, 'time')">
            {{ $dateFormat(getString(row, item), 'H:m') }}
          </div>
          <div v-else-if="dataType(item, 'date')">
            {{ $dateFormat(getString(row, item), 'YYYY/M/D') }}
          </div>
          <div v-else-if="dataType(item, 'datetime')">
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
export default {
  mixins: [mixin],
  props: {
    value: { type: Array, default: () => [] },
    disableActions: { type: Boolean, default: false }
  },
  data() {
    return { defaultProps: { stripe: true }, actionsWidth: '' }
  },
  updated() {
    this.calculateActionsWidth()
  },
  methods: {
    calculateActionsWidth() {
      const refs = { ...this.$refs.actions?.children?.[0]?.children }
      const keys = Object.keys(refs)
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
    },
    getConstant(row, item) {
      return item.constant[row[item.property]]
    },
    getString(row, item) {
      const result = row[this.propertyName(item)]
      return result?.__toString ?? result
    },
    imageUrl(images) {
      if (!images) return

      const result = Array.isArray(images) ? images[0] : images
      return this.$getImage(result)
    },
    imageList(images) {
      if (!images) return

      if (Array.isArray(images)) {
        return images.map((e) => this.$getImage(e))
      }

      return [this.$getImage(images)]
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
