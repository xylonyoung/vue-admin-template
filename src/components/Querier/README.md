# 搜索工具

## 示例

```html
<template>
  <div>
    <querier
      v-model="queryData"
      :querier-config="querierConfig"
      @confirm="queryChange"
    >
      <template v-slot:[querierConfig[2].property]="{func}">
        <el-input-number
          v-model="tempData"
          @change="func(querierConfig[2].property,$event)"
        />
      </template>
      <template v-slot:[querierConfig[3].property]="{slotData}">
        <el-input v-model="slotData[querierConfig[3].property]" />
      </template>
    </querier>
  </div>
</template>

<script>
  import Querier from '@/components/querier'
  export default {
    components: { Querier },
    name: 'App',
    data() {
      return {
        querierConfig: [
          {
            type: 'input',
            property: 'product.__metadata.name',
            props: { placeholder: '请输入产品名' }
          },
          {
            type: 'select',
            property: 'isOnSale',
            props: {
              placeholder: '上架或下架',
              style: 'width:120px'
            },
            getOptions: { api: '/manage/user', label: 'name', value: 'id' }
          },
          {
            type: 'slot',
            property: 'user.id'
          },
          {
            type: 'slot',
            property: 'user.name'
          },
          {
            type: 'component',
            property: 'year',
            component: {
              props: ['data'],
              render(h) {
                return (
                  <el-date-picker
                    style='width:100px'
                    v-model={this.data.year}
                    clearable
                    type='year'
                    value-format='yyyy'
                    placeholder='年份'
                  ></el-date-picker>
                )
              }
            }
          }
        ],
        tempData: null
      }
    },
    methods: {
      queryChange() {
        // do something
      }
    }
  }
</script>
```

## querierConfig item 参数

```js
// 类型 input, comparison, switch, select, date, range, slot and component
type: { type: String, required:true },

// 搜索数据格式化函数 fuzzySearch, equalSearch, multiSearch, comparisonSearch
// rangeSearch and dateSearch
formatFunc: { type: String},

// 查询字段 just like Object syntax (e.g., object.key.key)
property: { type: String, required:true },

// 默认值 default value
default: { type: Any },

// 标签属性 element's property and attribute
props: { type: Object },

// select 选项 (type 为 select 必填)
options: { type: Array },

// 获取选项，并配置选项 
// for select option (e.g., {api:'user', params, label:'name', value:'id'})
getOptions: { type: Object },
```

## 参考链接

- [element-ui](https://element.eleme.cn/#/zh-CN)
