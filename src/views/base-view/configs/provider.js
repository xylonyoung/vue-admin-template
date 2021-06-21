import { Regions } from '../components/form/Region'
import RegionsList from '../components/table/RegionsList'

// const providerType = ['施工', '销售']

export default {
  querierConfig: [
    {
      type: 'input',
      property: 'name',
      props: { placeholder: '请输入名称' }
    },
    {
      type: 'input',
      property: 'user.profile.phone',
      props: { placeholder: '请输入电话' }
    }
  ],

  tableConfig: [
    'id',
    'createdTime',
    'name',
    'user',
    {
      property: 'phone',
      component: {
        props: ['data'],
        render(h) {
          return <span>{this.data.user?.__metadata?.profile?.phone}</span>
        }
      }
    },
    'isConstructor',
    'isMarketing'
    // { property: 'regions', component: RegionsList() }
  ],

  formConfig: [
    'name',
    'user',
    'isConstructor',
    'isMarketing'
    // {
    //   property: 'regions',
    //   component: Regions()
    // }
    // {
    //   property: 'type',
    //   component: {
    //     props: ['form'],
    //     render(h) {
    //       return (
    //         <el-select v-model={this.form.type} placeholder='请选择'>
    //           {providerType.map((e, index) => (
    //             <el-option label={e} value={index}></el-option>
    //           ))}
    //         </el-select>
    //       )
    //     }
    //   }
    // }
  ]
}
