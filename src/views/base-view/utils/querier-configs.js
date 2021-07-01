const configs = [
  {
    type: 'select',
    property: 'staff.department',
    props: { placeholder: '请选部门' },
    getOptions: {
      api: '/business/businesses',
      formatFunc(data) {
        return optionFormat('departments', data)
      }
    }
  },
  {
    type: 'select',
    property: 'staff.group',
    props: { placeholder: '请选组别' },
    getOptions: {
      api: '/business/businesses',
      formatFunc(data) {
        return optionFormat('groups', data)
      }
    }
  }
]

export default configs

function optionFormat(property, data) {
  return data?.[property]?.map(e => ({ label: e, value: e }))
}
