<template>
  <el-form
    ref="form"
    :model="formData"
    :rules="rules"
    v-bind="configProps"
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
          v-model="formData[propertyName(item)]"
          :data="value"
          :form.sync="formData"
          :options="options"
          :property="item.property"
          :entity="entity"
        />
      </template>

      <template v-else-if="checkDataType(item, 'upload')">
        <component
          :is="Uploader(item.config)"
          v-model="formData[propertyName(item)]"
        />
      </template>

      <!-- data type -->
      <template v-else-if="isRelational(item)">
        <el-select
          v-model="formData[propertyName(item)]"
          v-loading="!options[propertyName(item)]"
          placeholder="请选择"
          clearable
          filterable
          :multiple="isToMany(item)"
        >
          <el-option
            v-for="(option, optionIndex) in options[propertyName(item)]"
            :key="optionIndex"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </template>
      <template v-else-if="checkDataType(item, 'array')">
        <component :is="DynamicTags()" v-model="formData[propertyName(item)]" />
      </template>
      <template v-else-if="checkDataType(item, 'boolean')">
        <el-switch
          v-model="formData[propertyName(item)]"
          active-text="是"
          inactive-text="否"
        />
      </template>
      <template v-else-if="checkDataType(item, 'time')">
        <el-time-picker
          v-model="formData[propertyName(item)]"
          format="HH:mm"
          value-format="HH:mm"
          placeholder="选择时间"
        />
      </template>
      <template v-else-if="checkDataType(item, 'date')">
        <el-date-picker
          v-model="formData[propertyName(item)]"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        />
      </template>
      <template v-else-if="checkDataType(item, 'datetime')">
        <el-date-picker
          v-model="formData[propertyName(item)]"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm"
          placeholder="选择日期时间"
        />
      </template>
      <template v-else-if="checkDataType(item, 'integer')">
        <el-input-number
          v-model="formData[propertyName(item)]"
          :min="0"
          :precision="0"
        />
      </template>
      <template v-else-if="checkDataType(item, 'float')">
        <el-input-number v-model="formData[propertyName(item)]" :min="0" />
      </template>
      <template v-else-if="checkDataType(item, 'decimal')">
        <el-input-number
          v-model="formData[propertyName(item)]"
          :min="0"
          :precision="getEntityMetadata('scale') || 2"
        />
      </template>
      <template v-else-if="checkDataType(item, 'text')">
        <el-input
          v-model="formData[propertyName(item)]"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 6 }"
          placeholder="请输入"
        />
      </template>
      <template v-else-if="checkDataType(item, 'textarea')">
        <tinymce v-model="formData[propertyName(item)]" :height="300" />
      </template>

      <template v-else>
        <el-input v-model="formData[propertyName(item)]" placeholder="请输入" />
      </template>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit()">保存</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
import mixin from '../Mixin'
import Uploader from '@/components/Uploader'
import buildEntityPath from '../buildEntityPath'
import Tinymce from '@/components/Tinymce'
import DynamicTags from '@/components/DynamicTags'
import { getRole } from '@/utils/auth'

export default {
  components: { Tinymce },
  mixins: [mixin],
  props: {
    value: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      defaultProps: { 'label-width': '100px' },
      options: {},
      rules: {},
      formData: {}
    }
  },
  watch: {
    value() {
      this.setConfig()
    }
  },
  methods: {
    Uploader,
    DynamicTags,
    isRelational(item) {
      return (
        this.checkDataType(item, 'ManyToOne') ||
        this.checkDataType(item, 'OneToOne') ||
        this.isToMany(item)
      )
    },
    isToMany(item) {
      return (
        this.checkDataType(item, 'ManyToMany') ||
        this.checkDataType(item, 'OneToMany')
      )
    },
    setConfig() {
      this.config.forEach((e) => {
        const property = this.propertyName(e)
        const value = this.value[property]

        // set formData
        if (value?.id) {
          this.$set(this.formData, property, value.id)
        } else if (Array.isArray(value) && value.length > 0) {
          this.$set(
            this.formData,
            property,
            value.map((e) => e?.id ?? e)
          )
        } else {
          this.$set(this.formData, property, value)
        }

        // check and set default
        if (typeof e === 'object' && 'default' in e) {
          // merge same type
          if (typeof e.default === typeof value) {
            this.formData[property] ??= e.default
          } else {
            this.formData[property] = e.default
          }
        }

        // set rules
        if (e.rule) {
          this.rules[property] = e.rule
        } else if (this.anEntity[property]?.metadata?.nullable === false) {
          this.rules[property] = [
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
      this.config.forEach((e) => {
        const propertyName = this.propertyName(e)
        let entityName
        let filter

        if (needOption.call(this, propertyName)) {
          entityName = /[^\\\\]\w+$/.exec(
            this.anEntity[propertyName]?.metadata?.targetEntity
          )[0]
        }

        if (e.options) {
          if (Array.isArray(e.options)) {
            this.$set(this.options, propertyName, e.options)
            return
          } else if (typeof e.options === 'string') {
            entityName = e.options
          } else {
            entityName = e.options?.entity
            filter = e.options?.filter
          }
        }

        if (entityName) {
          getOptionData.call(this, propertyName, entityName, filter)
        }
      })

      function getOptionData(propertyName, optionName, filter) {
        const anEntity = { name: optionName }
        let params = { '@display': 'reduce' }

        if (getRole() !== 'admin' && getRole()) {
          anEntity.prefix = getRole()
        }

        if (filter) params = { ...params, ...filter }

        this.$api.get(buildEntityPath(anEntity), { params }).then((res) => {
          const result = res?.data?.map((e) => ({
            value: e.id,
            label: e.name ?? e.title ?? e.__toString
          }))
          this.$set(this.options, propertyName, result)
        })
      }

      function needOption(propertyName) {
        const types = ['ManyToOne', 'ManyToMany', 'OneToMany', 'OneToOne']
        return types.includes(this.anEntity[propertyName]?.metadata?.type)
      }
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('submit', this.formData)
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
