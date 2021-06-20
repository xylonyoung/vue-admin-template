# 基础页面

## 1.创建路由

在 @/router/routes.js 文件创建所有的路由。
[路由和侧边栏](https://panjiachen.gitee.io/vue-element-admin-site/zh/guide/essentials/router-and-nav.html)

```js
export default [
  // 单项菜单
  {
    path: 'staff', // 设置路径
    entity: 'Staff', // 设置entity
    title: '员工管理',
    icon: 'el-icon-s-custom',
    // 设置component后将不使用 base-view
    component: import('@/views/staff/staff')
  },
  // 多项菜单
  {
    path: 'user',
    title: '用户管理',
    icon: 'el-icon-user-solid',
    children: [
      { entity: 'User', title: '用户' },
      { entity: 'UserProfile', title: '资料' }
    ]
  }
]
```

## 2.配置页面

在 Config 文件夹下创建所有 entities

- 注意文件名要和 路由的 path 一致并且使用 kebab-case

```js
export default {
  // 可关闭的功能
  disableActions: {
    type: Array,
    default: [],
    options: ['new', 'delete', 'edit', 'action']
  },
  // 默认表格查询
  tableQuery: {
    type: Object,
    default: {}
  },
  // 默认表格列表
  tableConfig: { type: Array, required: true },
  // 默认表单列表
  formConfig: { type: Array },
  // 新建表单列表 （此项存在时，新建表单时会使用此列表）
  formConfigForCreate: { type: Array },
  // 表格多选
  selection: { type: Boolean, default: false },
  // 多选中的选项是否可选 （selection为true时有效）
  selectableFunc: { type: Function, default: () => true },
  // 使用代办列表
  hasTodo: { type: Boolean, default: false },
  // 顶部组件
  topBarComponents: { type: Array }
}
// 基本例子
export default {
  tableQuery: {
    '@order': 'createdTime|DESC'
  },
  tableConfig: ['id', { property: 'username', label: '用户名' }],
  formConfig: ['phone'],
  formConfigForCreate: [{ property: 'name' }]
}
```

- 组件使用（直接在文件中配置以下属性）

  - querierConfig（搜索组件）

  ```js
  querierConfig: [
    {
      type: 'date',
      name: 'createdTime',
      props: {
        type: 'daterange',
        placeholder: '下单日期'
      }
    }
  ]
  ```

  - downloadFunc（下载 excel 文件）

  ```js
  downloadConfig: {
    api: '/manage/users',
    filename: '用户',
    tHeader: ['Id', '用户名'],
    filterVal: ['id', 'username'],
    formatFunc(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          switch (j) {
            case 'username':
              return v?.profile?.__toString ?? v[j]
            default:
              return v[j]?.__toString ?? v[j]
          }
        })
      )
    }
  }
  ```

  - upload-validator （导入 excel 文件）

  ```js
   uploadValidator: {
    title: '导入工资',
    filename: '工资模板',
    fields: {
      staff: '员工ID',
      amount: '工资',
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
      ]
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
    }
  }
  ```
