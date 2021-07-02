# Excel 导入组件

## 示例

```html
<template>
  <div>
    <upload-validator
      :title="title"
      :filename="filename"
      :visible.sync="uploadVisible"
      :fields="fields"
      :rules="rules"
      :upload-func="uploadFunc"
      @download="downloadFunc"
      @success="uploadSuccess"
    >
      <template v-slot="{slotData}">
        <el-input v-model="slotData.input" />
      </template>
    </upload-validator>
    <el-button type="primary" icon="el-icon-upload" @click="handleOpen">
      上传
    </el-button>
  </div>
</template>

<script>
  import UploadValidator from '@/components/upload-validator'
  export default {
    name: 'App',
    data() {
      return {
        title: '导入工资',
        filename: '工资模板',
        fields: {
          staff: '员工ID',
          amount: '工资'
        },
        rules: {
          amount: [
            { type: 'number', message: '工资必须为数字' },
            { required: true, message: '工资必须填写' },
            {
              validator: (rule, value, callback) => {
                if (value >= 0) {
                  callback()
                } else {
                  callback(new Error('工资必须为正数'))
                }
              }
            }
          ],
          department: {
            validator(rule, value, callback) {
              if (this.departments.some(e => e === value) || !value) {
                callback()
              } else {
                callback(new Error('部门有错'))
              }
            }
          }
        },
        visible: false
      }
    },
    methods: {
      uploadSuccess() {
        //上传成功回调
      },
      createdFunc() {
        this.$api.get('/business/businesses').then(res => {
          const { data } = res
          this.rules.department.departments = data?.departments ?? []
        })
      },
      uploadFunc(excelData) {
        return new Promise((resolve, reject) => {
          const waitPromise = []
          excelData.forEach(e => {
            waitPromise.push(this.$api.post('/manage/salaries', e))
          })
          Promise.all(waitPromise)
            .then(() => {
              resolve()
            })
            .catch(() => {
              reject()
            })
        })
      },
      async downloadFunc() {
        const res = await this.$api.get('/manage/staffs')

        if (res.data.length === 0) {
          this.$message.warning('公司暂无员工')
          return
        }

        const excel = await import('@/vendor/Export2Excel')
        const filterVal = Object.keys(this.fields)
        const data = formatFunc(filterVal, res.data)
        excel.export_json_to_excel({
          header: Object.values(this.fields),
          data,
          filename: this.filename
        })

        function formatFunc(filterVal, jsonData) {
          return jsonData.map(v =>
            filterVal.map(j => {
              switch (j) {
                case 'business':
                  return v[j]?.id
                case 'staff':
                  return v.id
                default:
                  return v[j]?.__toString ? v[j].__toString : v[j]
              }
            })
          )
        }
      },
      handleOpen() {
        this.visible = true
      }
    }
  }
</script>
```

## Props 参数

```js
const props = {
  // 弹窗标题
  title: { type: String, default: '表格导入' },

  // 弹窗开关
  visible: { type: Boolean, required: true },

  // 弹窗宽度
  dialogWidth: { type: String, default: '80%' },

  // 文件大小限制
  maxSize: { type: Number, default: Infinity },

  // 字段 假如数据库中是`name`字段, 而Excel模板列是`名字`, 就需要写成 name: '名字'
  fields: { type: Object, required: true },

  // 参数校检, 和 element-ui 中 form表单中传递的rules一样, 都是使用的 async-validator 库
  // https://element.eleme.cn/#/zh-CN/component/form#biao-dan-yan-zheng
  rules: { type: Object, default: () => ({}) },

  // 上传函数需要返回一个Promise对象
  uploadFunc: { type: Function, required: true },

  // 自定义下载模板
  downloadFunc: { type: Boolean, default: undefined },

  // 生命周期 created 执行的函数
  createdFunc: { type: Boolean, default: undefined },

  // 自定义组件
  component: { type: Boolean, default: undefined }
}
```

## 参考链接

- [vue-ele-import](https://www.npmjs.com/package/vue-ele-import)
- [vue-element-admin](https://panjiachen.gitee.io/vue-element-admin-site/zh/)
- [element-ui](https://element.eleme.cn/#/zh-CN)
- [SheetJS](https://github.com/SheetJS/js-xlsx)
