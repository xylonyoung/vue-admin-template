<template>
  <el-form
    ref="form"
    :model="data"
    :rules="rules"
    v-bind="mixedProps"
    v-on="events"
  >
    <el-form-item
      v-for="(item, index) in config"
      :key="index"
      :label="getLabel(item)"
      :prop="propertyName(item)"
      v-bind="item.props"
      v-on="item.events"
    >
      <template v-if="item.component">
        <component :is="item.component" />
      </template>

      <template v-else-if="dataType(item, 'Image')">
        <component
          :is="Uploader({ dataType: 'string' })"
          :data="data[propertyName(item)]"
        />
      </template>
      <template v-else-if="dataType(item, 'Pictures')">
        <component :is="Uploader()" :data="data[propertyName(item)]" />
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
      <template v-else-if="dataType(item, 'text')">
        <el-input
          v-model="data[propertyName(item)]"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="请输入"
        />
      </template>
      <template
        v-else-if="dataType(item, 'ManyToOne') || dataType(item, 'OneToOne')"
      >
        <el-select
          v-model="data[propertyName(item)]"
          v-loading="!options[propertyName(item)]"
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="(option, optionIndex) in options[propertyName(item)]"
            :key="optionIndex"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>
      <template
        v-else-if="dataType(item, 'ManyToMany') || dataType(item, 'OneToMany')"
      >
        <el-select
          v-model="data[propertyName(item)]"
          v-loading="!options[propertyName(item)]"
          placeholder="请选择"
          filterable
          multiple
        >
          <el-option
            v-for="(option, optionIndex) in options[propertyName(item)]"
            :key="optionIndex"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>
      <template v-else>
        <el-input v-model="data[propertyName(item)]" placeholder="请输入" />
      </template>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm()">确定</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import mixin from './mixin'
import Uploader from './Uploader'
import buildEntityPath from './buildEntityPath'
export default {
  mixins: [mixin],
  props: {
    data: { type: Object, default: () => ({}) },
    rules: { type: Object, default: () => ({}) }
  },
  data() {
    return { defaultProps: { 'label-width': '100px' }, options: {} }
  },
  watch: {
    entity: {
      handler() {
        this.setDefault()
        this.getOptions()
      },
      immediate: true
    }
  },
  methods: {
    Uploader,
    setRules() {},
    setDefault() {
      this.config.forEach((e) => {
        const name = this.propertyName(e)
        if (e.default) {
          this.data[name] = e.default
        }

        if (e.rule) {
          this.rules[name] = e.rule
        } else if (this.entity[name]?.metadata?.nullable === false) {
          this.rules[name] = [
            {
              required: true,
              message: '请输入此项',
              trigger: ['blur', 'change']
            }
          ]
        }
      })
    },
    getOptions() {
      for (const key in this.entity) {
        if (needOptions.call(this, key)) {
          const entity = getEntity.call(this, key)
          this.$api
            .get(buildEntityPath(entity), {
              params: { '@display': 'reduce' }
            })
            .then((res) => {
              const result = res?.data?.map((e) => ({
                value: e.id,
                label: e.name ?? e.title ?? e.__toString
              }))
              this.$set(this.options, key, result)
            })
        }
      }

      function getEntity(key) {
        const result = /[^\\\\]\w+$/.exec(
          this.entity[key]?.metadata?.targetEntity
        )
        return result[0]
      }

      function needOptions(key) {
        const types = ['ManyToOne', 'ManyToMany', 'OneToMany', 'OneToOne']
        if (!types.includes(this.entity[key]?.metadata?.type)) return false

        if (!this.config.some((e) => e.property ?? e === key)) return false

        return true
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit')
        } else {
          this.$message.error('表单输入有误！')
          return false
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
</style>
