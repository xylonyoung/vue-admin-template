import History from '@/components/Transition/History'

export default {
  tableConfig: [
    'id',
    'issue',
    'order',
    'pictures',
    { property: 'transitionContexts', component: History('transitionContexts') },
    'status',
    'user'
  ],

  formConfig: [
    'issue',
    'order',
    'pictures',
    'user'
  ]
}
