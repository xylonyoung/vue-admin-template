<template>
  <el-form
    ref="form"
    :model="data"
    :rules="rules"
    v-bind="mixedProps"
    v-on="events"
  >
    <el-form-item
      v-for="(item, index) in configs"
      :key="index"
      :label="getLabel(item)"
      :prop="propertyName(item)"
      v-bind="item.props"
      v-on="item.events"
    >
      <template v-if="item.component">
        <component :is="item.component" />
      </template>

      <template v-else-if="dataType(item, 'array')">1</template>
      <template v-else-if="dataType(item, 'boolean')">
        <el-switch
          v-model="data[propertyName(item)]"
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template v-else-if="dataType(item, 'date')">
        <el-date-picker
          v-model="data[propertyName(item)]"
          type="date"
          placeholder="选择日期"
        />
      </template>
      <template v-else-if="dataType(item, 'datetime')">
        <el-date-picker
          v-model="data[propertyName(item)]"
          type="datetime"
          placeholder="选择日期时间"
        />
      </template>
      <template v-else-if="dataType(item, 'integer')">
        <el-input-number v-model="data[propertyName(item)]" :min="0" />
      </template>
      <template v-else-if="dataType(item, 'string')">
        <el-input v-model="data[propertyName(item)]" placeholder="请输入" />
      </template>
      <template v-else-if="dataType(item, 'text')">
        <el-input
          v-model="data[propertyName(item)]"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="请输入"
        />
      </template>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">
        立即创建
      </el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import mixin from './mixin'
export default {
  mixins: [mixin],
  props: {
    data: { type: Object, default: () => ({}) },
    rules: { type: Object, default: () => ({}) }
  },
  data() {
    return { defaultProps: { 'label-width': '100px' } }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
