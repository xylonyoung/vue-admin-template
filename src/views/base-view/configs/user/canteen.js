import Select from '../../components/Select'

export default {
  tableConfig: ['id', 'name', 'no', 'contact', 'phone', 'status'],

  formConfig: [
    'business',
    'contact',
    'description',
    'name',
    'no',
    {
      property: 'phases',
      option: 'phases',
      component: Select('phases', 'phases', { multiple: true })
    },
    'phone',
    'status',
    'user'
  ]
}
