<template>
  <el-form
    ref="form"
    :model="data"
    :rules="rules"
    v-bind="mixedProps"
    v-on="events"
    @submit.native.prevent
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
        <component
          :is="item.component"
          v-model="data[propertyName(item)]"
          :data.sync="data"
          :options="options"
          :property="item.property"
        />
      </template>

      <template v-else-if="dataType(item, 'upload')">
        <component
          :is="Uploader(item.config)"
          v-model="data[propertyName(item)]"
        />
      </template>
      <template v-else-if="dataType(item, 'array')">
        <component :is="DynamicTags()" v-model="data[propertyName(item)]" />
      </template>
      <template v-else-if="dataType(item, 'boolean')">
        <el-switch
          v-model="data[propertyName(item)]"
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template v-else-if="dataType(item, 'time')">
        <el-time-picker
          v-model="data[propertyName(item)]"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="选择时间"
        />
      </template>
      <template v-else-if="dataType(item, 'date')">
        <el-date-picker
          v-model="data[propertyName(item)]"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </template>
      <template v-else-if="dataType(item, 'datetime')">
        <el-date-picker
          v-model="data[propertyName(item)]"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
        />
      </template>
      <template v-else-if="dataType(item, 'integer')">
        <el-input-number
          v-model="data[propertyName(item)]"
          :min="0"
          :precision="0"
        />
      </template>
      <template v-else-if="dataType(item, 'float')">
        <el-input-number v-model="data[propertyName(item)]" :min="0" />
      </template>
      <template v-else-if="dataType(item, 'decimal')">
        <el-input-number
          v-model="data[propertyName(item)]"
          :min="0"
          :precision="getEntityMetadata('scale') || 2"
        />
      </template>
      <template v-else-if="dataType(item, 'text')">
        <el-input
          v-model="data[propertyName(item)]"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="请输入"
        />
      </template>
      <template v-else-if="dataType(item, 'textarea')">
        <tinymce v-model="data[propertyName(item)]" :height="300" />
      </template>
      <template
        v-else-if="dataType(item, 'ManyToOne') || dataType(item, 'OneToOne')"
      >
        <el-select
          v-model="selectValue[propertyName(item)]"
          v-loading="!options[propertyName(item)]"
          placeholder="请选择"
          clearable
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
          v-model="selectValue[propertyName(item)]"
          v-loading="!options[propertyName(item)]"
          placeholder="请选择"
          clearable
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
import mixin from '../mixin'
import Uploader from '@/components/Uploader'
import buildEntityPath from '../buildEntityPath'
import Tinymce from '@/components/Tinymce'
import DynamicTags from '@/components/DynamicTags'
import { entityPrefix } from '@/settings'
import { getRole } from '@/utils/auth'

export default {
  components: { Tinymce },
  mixins: [mixin],
  props: {
    data: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      defaultProps: { 'label-width': '100px' },
      options: {},
      rules: {},
      selectValue: {}
    }
  },
  created() {
    this.setConfig()
    this.getOptions()
  },
  methods: {
    Uploader,
    DynamicTags,
    setConfig() {
      this.config.forEach((e) => {
        const property = this.propertyName(e)
        const value = this.data[property]
        // set selectValue
        if (value?.id) {
          this.$set(this.selectValue, property, value.id)
        } else if (Array.isArray(value)) {
          this.$set(
            this.selectValue,
            property,
            value.map((e) => e?.id ?? e)
          )
        }
        // set rules
        if (e.rule) {
          this.rules[property] = e.rule
        } else if (this.entity[property]?.metadata?.nullable === false) {
          this.rules[property] = [
            {
              required: true,
              message: '请输入此项',
              trigger: ['blur', 'change']
            }
          ]
        }
        // set default
        if (e.default) {
          this.data[property] ??= e.default
        }
      })
    },
    getOptions() {
      this.config.forEach((e) => {
        const propertyName = this.propertyName(e)
        if (e.options) {
          this.$set(this.options, propertyName, e.options)
          return
        }

        if (e.option) {
          getOptionData.call(this, propertyName, e.option)
          return
        }

        if (needOption.call(this, propertyName)) {
          getOptionData.call(
            this,
            propertyName,
            getOptionName.call(this, propertyName)
          )
        }
      })

      function getOptionData(propertyName, entity) {
        const anEntity = { name: entity }
        if (getRole() !== 'admin' && entityPrefix) {
          anEntity.prefix = entityPrefix
        }

        this.$api
          .get(buildEntityPath(anEntity), {
            params: { '@display': 'reduce' }
          })
          .then((res) => {
            const result = res?.data?.map((e) => ({
              value: e.id,
              label: e.name ?? e.title ?? e.__toString
            }))
            this.$set(this.options, propertyName, result)
          })
      }

      function getOptionName(propertyName) {
        const result = /[^\\\\]\w+$/.exec(
          this.entity[propertyName]?.metadata?.targetEntity
        )
        return result[0]
      }

      function needOption(propertyName) {
        const types = ['ManyToOne', 'ManyToMany', 'OneToMany', 'OneToOne']
        return types.includes(this.entity[propertyName]?.metadata?.type)
      }
    },
    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // merge selectValue to data
          for (const key in this.selectValue) {
            if (this.selectValue[key]) {
              this.data[key] = this.selectValue[key]
            }
          }
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
