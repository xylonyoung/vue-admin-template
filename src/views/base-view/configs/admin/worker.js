import { Region, Regions, RegionList } from '@/components/Region'

export default {
  querierConfig: [
    {
      type: 'input',
      property: 'name',
      props: { placeholder: '请输入名称' }
    },
    {
      type: 'component',
      property: 'regions',
      component: Region(),
      formatFunc: 'arrayPropertyQuery'
    },
    {
      type: 'input',
      property: 'phone',
      props: { placeholder: '请输入电话' }
    },
    {
      type: 'select',
      property: 'enabled',
      props: {
        placeholder: '请选择状态',
        style: 'width:120px'
      },
      options: [
        {
          value: true,
          label: '激活'
        },
        {
          value: false,
          label: '未激活'
        }
      ]
    }
  ],

  tableConfig: [
    'id',
    { property: 'regions', component: RegionList() },
    'name',
    'phone',
    'enabled',
    'comment'
  ],

  formConfig: [
    'user',
    'name',
    'phone',
    'enabled',
    'habitation',
    { property: 'regions', component: Regions() },
    'birthday',
    'serviceRange',
    'wallclothExperience',
    'wallclothMaxCapacityPerDay',
    'wallclothMinAcceptReward',
    'wallpaperExperience',
    'wallpaperMaxCapacityPerDay',
    'wallpaperMinAcceptReward',
    'hasCarVehicleLicense',
    'hasMotoVehicleLicense',
    'hasVehicle',
    { property: 'idCardPhotos', type: 'upload' },
    'comment'
  ]
}
