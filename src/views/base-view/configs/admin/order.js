import {
  ORDER_STATUS,
  ORDER_TYPE,
  ORDER_WALL_TYPE,
  ORDER_HAS_SCALING,
  ORDER_HAS_FURNITURE,
  ORDER_SPECIAL_WALL,
  getConstantOptions
} from '@/constants'
import RowDetail from '@/components/Base/Table/RowDetail'
import ItemTable from '@/components/Base/Table/ItemTable'
import { Region } from '@/components/Region'
import { getRole } from '@/utils/auth'
import ShowValue from '@/components/Base/Table/ShowValue'

const RowDetailTag = RowDetail([
  {
    property: 'type',
    component: ShowValue(ORDER_TYPE)
  },
  {
    property: 'status',
    component: ShowValue(ORDER_STATUS)
  },
  'createdTime',
  'region',
  'address',
  'contact',
  'phone',
  'comment',
  'worker',
  'contact2',
  'phone2',
  'totalPrice',
  'discount',
  'shippingPrice',
  'price',
  'pickupAddress',
  'pickupCode',
  {
    property: 'wallType',
    component: ShowValue(ORDER_WALL_TYPE)
  },
  {
    property: 'hasScaling',
    component: ShowValue(ORDER_HAS_SCALING)
  },
  {
    property: 'hasFurniture',
    component: ShowValue(ORDER_HAS_FURNITURE)
  },
  {
    property: 'specialWall',
    component: ShowValue(ORDER_SPECIAL_WALL)
  },
  'measureResult'
])

const RowDetailImage = RowDetail(
  [
    {
      property: 'specialWallPhoto',
      type: 'image'
    },
    {
      property: 'environmentPhoto',
      type: 'image'
    },
    {
      property: 'finishPhoto',
      type: 'image'
    }
  ],
  '图片'
)

const ItemTableTag = ItemTable(
  [
    { label: '服务', prop: '__toString' },
    { label: '数量', prop: '__metadata.quantity' }
  ],
  '施工内容'
)

export default {
  disableActions: ['action', 'new'],

  querierConfig: [
    {
      type: 'date',
      property: 'createdTime',
      props: { type: 'daterange' }
    },
    {
      type: 'input',
      property: 'phone',
      props: { placeholder: '请输入电话' }
    },
    {
      type: 'select',
      property: 'status',
      props: { placeholder: '请选订单状态' },
      options: getConstantOptions(ORDER_STATUS)
    },
    {
      type: 'input',
      property: 'region',
      props: { placeholder: '请输入地区' }
    },
    {
      type: 'input',
      property: 'worker.name',
      props: { placeholder: '请输入施工工人' }
    },
    {
      default: ['status', 'entity.getStatus() > 1'],
      component: {
        props: ['func'],
        render(h) {
          return (
            <el-checkbox v-model={this.checked} onChange={this.onChange}>
              全部
            </el-checkbox>
          )
        },
        data() {
          return {
            checked: false
          }
        },
        methods: {
          onChange(val) {
            let result = 'entity.getStatus() > 0'
            if (val) {
              result = ''
            }
            this.func('status', result)
          }
        }
      }
    }
  ],

  tableQuery: {
    '@order': 'createdTime|DESC'
  },

  tableConfig: [
    'id',
    'createdTime',
    'region',
    'address',
    {
      property: 'type',
      component: ShowValue(ORDER_TYPE)
    },
    'comment',
    'contact',
    'phone',
    {
      property: 'status',
      component: {
        props: ['value'],
        render(h) {
          return (
            <el-tag type={this.value > 0 ? 'success' : 'danger'}>
              {ORDER_STATUS[this.value]}
            </el-tag>
          )
        }
      }
    },
    {
      label: '查看',
      props: { width: '240px' },
      component: {
        props: ['row', 'entity', 'value'],
        render(h) {
          return (
            <div style={{ display: 'flex' }}>
              <RowDetailTag row={this.row} entity={this.entity} />

              <RowDetailImage
                row={this.row}
                entity={this.entity}
                style={{ margin: '0 10px' }}
              />

              {this.row.type === 'construction' && (
                <ItemTableTag v-model={this.row.items} />
              )}
            </div>
          )
        }
      }
    },
    EditHandler()
  ],

  downloadConfig: {
    api: '/provider/orders',
    filename: '订单',
    tHeader: [
      '下单时间',
      '地区',
      '类型',
      '地址',
      '联系人',
      '联系电话',
      '订单状态',
      '服务总价',
      '订单折扣',
      '代付运费',
      '实收金额',
      '施工工费',
      '下单用户',
      '施工工人',
      '订单备注'
    ],
    filterVal: [
      'createdTime',
      'region',
      'type',
      'address',
      'contact',
      'phone',
      'status',
      'totalPrice',
      'discount',
      'shippingPrice',
      'price',
      'workerFee',
      'user',
      'worker',
      'comment'
    ],
    formatFunc(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          switch (j) {
            case 'type':
              return this.type[v[j]]
            case 'createdTime':
              return this.$dateFormat(v[j])
            default:
              return v[j]?.__toString ?? v[j]
          }
        })
      )
    }
  }
}

function EditHandler() {
  return {
    label: '设置',
    props: { fixed: 'right' },
    component: {
      props: ['row', 'entity', 'value'],
      render(h) {
        const RegionTag = Region()
        if (Number(this.row.status) === 2) {
          return (
            <el-button type='success' size='small' onClick={this.orderReceive}>
              接单
            </el-button>
          )
        }

        if (![6, 21].includes(Number(this.row.status))) return

        return (
          <div>
            <div style={{ display: 'flex' }}>
              <el-button
                type='info'
                size='small'
                onClick={() => {
                  this.dialogVisible = true
                }}
              >
                工人和工费
              </el-button>
            </div>
            <el-dialog
              title='请填写指派的工人和工费'
              append-to-body
              visible={this.dialogVisible}
              on={{
                'update:visible': val => {
                  this.dialogVisible = val
                }
              }}
              width='800px'
            >
              <el-form label-width='80px'>
                <el-form-item label='工人区域'>
                  <RegionTag v-model={this.region} />
                </el-form-item>
                <el-form-item label='指派工人' v-loading={this.loading}>
                  <el-select
                    v-model={this.formData.worker}
                    placeholder='请选择'
                  >
                    {this.workList.map(e => (
                      <el-option label={e.name} value={e.id}></el-option>
                    ))}
                  </el-select>
                </el-form-item>
                <el-form-item label='施工工费'>
                  <el-input-number
                    v-model={this.formData.workerFee}
                    min={0}
                    precision={2}
                  />
                </el-form-item>
                <el-form-item>
                  <el-button type='primary' onClick={this.onSubmit}>
                    保存
                  </el-button>
                </el-form-item>
              </el-form>
            </el-dialog>
          </div>
        )
      },
      data() {
        return {
          dialogVisible: false,
          prefix: getRole() === 'admin' ? '/manage/' : '/provider/',
          formData: {},
          sendConfig: [],
          region: null,
          workList: [],
          loading: false
        }
      },
      watch: {
        region(val) {
          if (!val) return

          this.loading = true
          this.$api
            .get(this.prefix + 'workers', {
              params: {
                '@filter': `"${val}" in entity.getRegions()`
              }
            })
            .then(res => {
              this.workList = res.data
              this.loading = false
            })
        }
      },
      created() {
        const { worker, workerFee } = this.row
        if (worker) {
          this.workList = [{ id: worker.id, name: worker.__toString }]
          this.formData.worker = worker.id
        }
        if (workerFee) {
          this.formData.workerFee = workerFee
        }
      },
      methods: {
        onSubmit() {
          this.$api
            .put(this.prefix + 'orders/' + this.row.id, {
              ...this.formData,
              status: 6
            })
            .then(res => {
              this.dialogVisible = false
              this.$emit('update:row', res.data)
              this.$message.success('保存成功')
            })
        },
        orderReceive() {
          this.$api
            .put(this.prefix + 'orders/' + this.row.id, { status: 21 })
            .then(res => {
              this.$emit('update:row', res.data)
              this.$message.success('接单成功')
            })
        }
      }
    }
  }
}
