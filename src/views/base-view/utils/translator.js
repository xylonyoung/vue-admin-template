export const cnNames = {
  accountNumber: '账户号码',
  attachment: '附件',
  attendancePhoto: '出勤图片',
  amount: '总金额',
  arriveDate: '报到日期',
  bankCity: '银行城市',
  bankName: '银行名',
  comment: '备注',
  entryAgreement: '入职协议',
  entryDate: '入职日期',
  group: '可看组别',
  idCardPhoto: '身份证图片',
  idCardNo: '身份证号码',
  insureDate: '保险日期',
  isActive: '是否激活',
  isSettled: '是否固定',
  isVerification: '是否确认',
  no: '号码',
  month: '月份',
  otherBusinessName: '其他公司',
  phone: '手机号码',
  quantity: '数量',
  quitAgreement: '离职协议',
  quitDate: '离职日期',
  receiptPlan: '发单方案',
  recruitPlan: '招聘方案',
  recruitSource: '招聘来源',
  totalHours: '工时',
  sendDate: '送给时间',
  staff: '员工',
  status: '状态',
  year: '年份',
  absent: '旷工扣款',
  actual: '实付工资',
  allowances: '补贴',
  borrow: '借支',
  commission: '服务费',
  fee: '手续费',
  insurance: '商业保险费',
  management: '管理费',
  other: '其他扣款',
  quitProtocol: '离职证明',
  tax: '个税扣款',
  unitPrice: '单价'
}

export const statusToCn = {
  complete: '完成',
  draft: '草稿',
  factory_audit: '驻场审核',
  finance_audit: '财务审核',
  reject: '申请不通过',
  transfer_audit: '财务转账'
}

export function translator(arr, type) {
  return arr.map(e => {
    const name = e?.property ?? e
    if (!cnNames[name]) {
      return e
    }

    let result

    if (typeof e === 'string') {
      result = { property: name }
    } else {
      result = { ...e }
    }

    if (type === 'form') {
      result['field_options'] = {
        label: cnNames[name],
        ...result['field_options']
      }
    } else {
      result = { label: cnNames[name], ...result }
    }
    return result
  })
}
