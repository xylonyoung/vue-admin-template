import querierConfigs from '../../utils/querier-configs'

export default {
  disableActions: ['action', 'new'],

  querierConfig: [
    { type: 'date', property: 'date' },
    {
      type: 'select',
      property: 'canteen.id',
      props: { placeholder: '请选饭堂' },
      getOptions: { api: '/business/canteens', label: 'name', value: 'id' }
    },
    {
      type: 'select',
      property: 'phase.id',
      props: { placeholder: '请选餐类' },
      getOptions: { api: '/business/phases', label: 'name', value: 'id' }
    },
    {
      type: 'select',
      property: 'staff.id',
      props: { placeholder: '请选员工' },
      getOptions: { api: '/business/staffs', label: 'name', value: 'id' }
    },
    ...querierConfigs
  ],

  tableConfig: ['id', 'canteen', 'date', 'phase', 'staff'],

  formConfig: ['canteen', 'date', 'phase', 'staff'],

  downloadConfig: {
    api: '/business/dinings',
    filename: '就餐',
    tHeader: ['Id', '饭堂', '日期', '餐类', '员工'],
    filterVal: ['id', 'canteen', 'date', 'phase', 'staff'],
    formatFunc(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          switch (j) {
            case 'date':
              return this.$dateFormat(v[j], 'YYYY/M/D')
            default:
              return v[j]?.__toString ?? v[j]
          }
        })
      )
    }
  }
}
