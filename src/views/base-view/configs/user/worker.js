import worker from '../admin/worker'

export default {
  disabledActions: ['delete'],

  ...worker,

  formConfig: ['enabled', 'comment']
}
