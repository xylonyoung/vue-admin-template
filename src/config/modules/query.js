import { dynamicPath } from '@/router/path-control'

export const aBusiness = {
  type: 'select',
  property: 'business.id',
  getOptions: {
    api: '/manage/businesses',
    label: 'name',
    value: 'id'
  }
}

export const aNo = {
  type: 'input',
  property: 'name',
  props: { placeholder: '请输入号码' }
}

export const aName = {
  type: 'input',
  property: 'name',
  props: { placeholder: '请输入名称' }
}

export const aDate = { type: 'date', property: 'date' }

export const aCanteen = {
  type: 'select',
  property: 'canteen.id',
  props: { placeholder: '请选饭堂' },
  getOptions: {
    api: dynamicPath('canteen'),
    label: 'name',
    value: 'id'
  }
}

export const aPhase = {
  type: 'select',
  property: 'phase.id',
  props: { placeholder: '请选餐类' },
  getOptions: { api: dynamicPath('phase'), label: 'name', value: 'id' }
}

export const aStaff = {
  type: 'select',
  property: 'staff.id',
  props: { placeholder: '请选员工' },
  getOptions: { api: dynamicPath('staff'), label: 'name', value: 'id' }
}

export const aDepartment = {
  type: 'select',
  property: 'staff.department',
  props: { placeholder: '请选部门' },
  getOptions: {
    api: '/business/businesses',
    formatFunc(data) {
      return optionFormat('departments', data)
    }
  }
}

export const aGroup = {
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

function optionFormat(property, data) {
  return data?.[property]?.map(e => ({ label: e, value: e }))
}
