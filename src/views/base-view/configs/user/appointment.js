export default {
  disableActions: ['action', 'new'],

  querierConfig: [
    { type: 'date', property: 'date' },
    {
      type: 'select',
      property: 'canteen',
      props: { placeholder: '请选饭堂' },
      getOptions: { api: '/business/canteens', label: 'name', value: 'id' }
    },
    {
      type: 'select',
      property: 'phase',
      props: { placeholder: '请选餐类' },
      getOptions: { api: '/business/phases', label: 'name', value: 'id' }
    },
    {
      type: 'select',
      property: 'staff',
      props: { placeholder: '请选员工' },
      getOptions: { api: '/business/staffs', label: 'name', value: 'id' }
    },
    {
      type: 'select',
      property: 'departments',
      props: { placeholder: '请选部门' },
      getOptions: { api: '/business/staffs', label: 'name', value: 'id' }
    },
    {
      type: 'select',
      property: 'groups',
      props: { placeholder: '请选组别' },
      getOptions: { api: '/business/staffs', label: 'name', value: 'id' }
    }
  ],

  tableConfig: ['id', 'date', 'canteen', 'phase', 'staff'],

  formConfig: ['canteen', 'date', 'phase', 'staff']
}
