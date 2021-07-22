import { ROLES_LIST, getConstantOptions } from '@/config/constants'
import Checkbox from '@/components/Base/Form/Checkbox'

// import routes from '@/router/routes'
// const routeList = routes.map(e => ({ label: e.title, value: e.path }))

const formConfig = [
  'username',
  'plainPassword',
  {
    property: 'enabled',
    type: 'boolean',
    default: true
  },
  {
    property: 'roles',
    default: [],
    component: Checkbox(getConstantOptions(ROLES_LIST))
  }
]

export default {
  disableActions: ['delete'],

  querierConfig: [
    {
      type: 'input',
      property: 'username',
      props: { placeholder: '请输入户名' }
    }
  ],

  tableQuery: {
    '@order': 'id|DESC'
  },

  tableConfig: [
    'id',
    'username',
    {
      property: 'roles',
      component: {
        props: ['value'],
        render(h) {
          return (
            <div>
              {this.value?.map(e => {
                return <el-tag type='info'>{ROLES_LIST[e]}</el-tag>
              })}
            </div>
          )
        }
      }
    },
    { property: 'enabled', type: 'boolean' },
    'createdTime'
  ],

  formConfig: [...formConfig, 'email'],

  formConfigForCreate: [
    ...formConfig,
    {
      property: 'email',
      component: {
        props: ['value', 'form'],
        render(h) {
          return <div>{this.value}</div>
        },
        watch: {
          'form.username'(val) {
            if (val) {
              this.$emit('input', `${val}@mail.com`)
            } else {
              this.$emit('input', '')
            }
          }
        }
      }
    }
  ]

  // downloadConfig: {
  //   api: '/manage/users',
  //   filename: '用户',
  //   tHeader: ['Id', '用户名'],
  //   filterVal: ['id', 'username'],
  //   formatFunc(filterVal, jsonData) {
  //     return jsonData.map(v =>
  //       filterVal.map(j => {
  //         switch (j) {
  //           case 'username':
  //             return v?.profile?.__toString ?? v[j]
  //           default:
  //             return v[j]?.__toString ?? v[j]
  //         }
  //       })
  //     )
  //   }
  // }
}
