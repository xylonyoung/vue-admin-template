<template>
  <div>
    <el-table :data="data" v-bind="mixedProps" v-on="events">
      <slot name="selection" />

      <el-table-column
        v-for="(item, index) in config"
        :key="index"
        :label="getLabel(item)"
        v-bind="item.props"
        v-on="item.events"
      >
        <template slot-scope="{ row }">
          <div v-if="item.component">
            <component :is="item.component" :data="row" />
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
          <div v-else-if="dataType(item, 'status')">
            {{ getStatus(row, item) }}
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
          <slot name="actions" :data="row" />
        </div>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import mixin from '../mixin'
export default {
  mixins: [mixin],
  props: {
    data: { type: Array, default: () => [] },
    disableActions: { type: Boolean, default: false }
  },
  data() {
    return { defaultProps: { stripe: true }, actionsWidth: '' }
  },
  updated() {
    this.actionsWidth =
      this.$refs.actions?.childNodes?.[0]?.scrollWidth + 24 + 'px'
  },
  methods: {
    getStatus(row, item) {
      return item.status[row[item.property]]
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
