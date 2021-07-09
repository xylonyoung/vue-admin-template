import { Regions, RegionList } from '@/components/Region'

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
    'name',
    'user',
    {
      property: 'phone',
      component: {
        props: ['row'],
        render(h) {
          return <span>{this.row.user?.__metadata?.profile?.phone}</span>
        }
      }
    },
    'isConstructor',
    'isMarketing',
    { property: 'regions', component: RegionList() }
  ],

  formConfig: [
    'name',
    'user',
    'isConstructor',
    'isMarketing',
    { property: 'regions', component: Regions() }
  ]
}
