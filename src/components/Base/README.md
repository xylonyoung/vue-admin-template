# 表单和表格

## 示例

```html
<template>
  <div>
    <base-table
      v-model="tableData"
      v-loading="tableLoading"
      :entity="entity"
      :config="tableConfig"
      :props="tableProps"
      :events="tableEvents"
      :disable-actions="disableActions.includes('action')"
    >
      <template v-if="selection" #selection>
        <el-table-column
          type="selection"
          width="55"
          :selectable="selectableFunc"
        />
      </template>

      <template #actions="{ row }">
        <div style="display: flex">
          <el-button
            v-if="!disableActions.includes('edit')"
            size="small"
            @click="editForm(row.id)"
          >
            修改
          </el-button>
          <el-popconfirm
            v-if="!disableActions.includes('delete')"
            style="margin-left: 10px"
            confirm-button-text="确认"
            cancel-button-text="取消"
            icon="el-icon-info"
            icon-color="red"
            title="确定删除吗？"
            @confirm="handleDelete(row.id)"
          >
            <el-button slot="reference" size="small" type="danger">
              删除
            </el-button>
          </el-popconfirm>
        </div>
      </template>
    </base-table>

    <base-form
      v-model="formData"
      :entity="entity"
      :config="formConfig"
      :props="formProps"
      :events="formEvents"
      @submit="formSubmit"
    />
  </div>
</template>

<script>
  import BaseTable from '@/components/Base/Table'
  import BaseForm from '@/components/Base/Form'
  export default {
    components: { BaseTable, BaseForm },
    methods: {
      formSubmit(formData) {
        //do something with formData
      }
    }
  }
</script>
```

## props 参数配置

```ts
type props = {
  config: (object | string)[] // 详细见下面 config
  props: object // el-from | el-table component props
  events: objet // el-from | el-table component events
  entity: object | string
  value: array | object // table: array, form: object
  // 禁用表格操作栏
  disableActions: boolean // default: false
}

type config = {
  property: string
  label: string
  props: object // el-form-item | el-table-column component props
  events: objet // el-form-item | el-table-column component events
  default: any // 默认值
  component: object //组件 props 详细见下面 componentProps
  rules: object // el-form 校验规则 https://element.eleme.cn/#/zh-CN/component/form
  // 表单选项，array 直接使用，string 为 entity 获取数据，object 根据 params 筛选获取数据
  options: array | string | { entity: string; params: object }
}

type componentProps = {
  value: any
  property: string
  entity: object | string
  data: object // 原数据
  form: object // 表单数据
  options: object // 表单选项
  row: object // 表格行数据
}
```

## 参考链接

- [element-ui](https://element.eleme.cn/#/zh-CN)
