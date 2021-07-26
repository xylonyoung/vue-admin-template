<template>
  <div class="querier-container">
    <div v-for="(item, index) in querierConfig" :key="index" class="query-item">
      <el-checkbox
        v-if="item.type === 'checkbox'"
        v-model="queryData[item.property]"
        v-bind="bindProps(item)"
      >
        {{ item.label }}
      </el-checkbox>

      <el-input
        v-else-if="item.type === 'comparison'"
        v-model="queryData[item.property][0]"
        class="comparison"
        v-bind="bindProps(item)"
        @keyup.enter.native="confirm"
      >
        <el-select slot="prepend" v-model="queryData[item.property][1]">
          <el-option label="等于" value="==" />
          <el-option label="大于" value=">" />
          <el-option label="小于" value="<" />
          <el-option label="大于或等于" value=">=" />
          <el-option label="小于或等于" value="<=" />
        </el-select>
      </el-input>

      <el-date-picker
        v-else-if="item.type === 'date'"
        v-model="queryData[item.property]"
        v-bind="bindProps(item)"
      />

      <el-input
        v-if="item.type === 'input'"
        v-model="queryData[item.property]"
        v-bind="bindProps(item)"
        @keyup.enter.native="confirm"
      />

      <div v-else-if="item.type === 'range'" class="rangeInput">
        <el-input
          v-model="queryData[item.property][0]"
          v-bind="bindProps(item)"
          @keyup.enter.native="confirm"
        />
        <i class="el-icon-minus" />
        <el-input
          v-model="queryData[item.property][1]"
          v-bind="bindProps(item)"
          @keyup.enter.native="confirm"
        />
      </div>

      <el-select
        v-else-if="item.type === 'select'"
        v-model="queryData[item.property]"
        v-bind="bindProps(item)"
        clearable
      >
        <el-option
          v-for="(option, optionIndex) in item.options"
          :key="optionIndex"
          :label="option.label"
          :value="option.value"
        />
      </el-select>

      <el-switch
        v-else-if="item.type === 'switch'"
        v-model="queryData[item.property]"
        v-bind="bindProps(item)"
      />

      <slot
        v-else-if="item.type === 'slot'"
        :slotData="queryData"
        :property="item.property"
        :func="setComponentData"
      />

      <template v-else-if="item.component">
        <component
          :is="item.component"
          v-model="queryData[item.property]"
          :property="item.property"
          :func="setComponentData"
        />
      </template>
    </div>

    <div v-if="querierConfig.length > 0" class="query-item">
      <el-button type="primary" icon="el-icon-search" @click="confirm">
        搜索
      </el-button>
    </div>
  </div>
</template>
<script>
import QueryData from './QueryData'
export default {
  props: {
    querierConfig: { type: Array, default: () => [] }
  },
  data() {
    return { queryData: {}, componentData: {}}
  },
  watch: {
    querierConfig: {
      handler(val, oldVal) {
        if (val.length > 0 && val !== oldVal) {
          this.checkConfig()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    setComponentData(property, val) {
      this.$set(this.componentData, property, val)
    },
    checkConfig() {
      let haveDefault = false
      this.querierConfig.forEach((e, index) => {
        if ('default' in e) {
          haveDefault = true
          if (Array.isArray(e.default)) {
            this.setComponentData(...e.default)
          } else {
            this.$set(this.queryData, e.property, e.default)
          }
        }

        // get options data, and set data reactive!
        if (e.getOptions) {
          const { getOptions } = e
          const params = getOptions.params ?? ''
          this.$api(getOptions.api, { params }).then((res) => {
            const result = getOptions.formatFunc
              ? getOptions.formatFunc(res.data)
              : res.data.map((i) => {
                return {
                  label: i[getOptions.label],
                  value: i[getOptions.value]
                }
              })
            this.$set(this.querierConfig[index], 'options', result)
          })
        }
        if (e.type === 'comparison') {
          this.$set(this.queryData, e.property, [null, '=='])
        }
        if (e.type === 'range') {
          this.$set(this.queryData, e.property, [null, null])
        }
      })

      if (haveDefault) {
        this.confirm()
      }
    },
    bindProps(item) {
      const defaultProps = {
        input: {
          clearable: true,
          style: { width: '150px' }
        },
        comparison: {
          clearable: true,
          style: { width: '250px' }
        },
        range: {
          clearable: true,
          style: { width: '100px' }
        },
        switch: {
          activeColor: '#13ce66',
          inactiveColor: '#ff4949'
        },
        date: dateProps(item.props),
        select: { clearable: true, filterable: true }
      }

      if (item.props) return { ...aDefaultProp(), ...item.props }
      return aDefaultProp()

      function aDefaultProp() {
        return defaultProps[item.type] ?? {}
      }

      function dateProps(props) {
        if (props?.type === 'daterange') {
          return {
            'range-separator': '至',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期',
            clearable: true,
            style: { width: '250px' }
          }
        }

        return {
          type: 'date',
          placeholder: '请选择日期',
          clearable: true,
          style: { width: '150px' }
        }
      }
    },
    confirm() {
      this.updateQuerierData()
      this.$emit('confirm')
    },
    updateQuerierData() {
      const result = new QueryData(
        this.queryData,
        this.querierConfig,
        this.componentData
      )
      this.$emit('input', result.dataProcess())
    }
  }
}
</script>
<style lang='scss' scoped>
.querier-container {
  display: flex;
  align-items: center;
  .query-item + .query-item {
    margin-left: 10px;
  }
}
.comparison {
  .el-select {
    width: 120px;
  }
  ::v-deep .el-input-group__prepend {
    background: #fff;
  }
}
.rangeInput {
  display: flex;
  align-items: center;
  i {
    margin: 0 5px;
  }
}
</style>
