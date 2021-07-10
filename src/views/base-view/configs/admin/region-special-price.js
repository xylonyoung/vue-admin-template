import { Region, RegionUpload } from '@/components/Region'

export const querierConfig = [
  {
    type: 'input',
    property: 'region.__toString',
    props: { placeholder: '请输入区域' }
  },
  {
    type: 'component',
    property: 'category.id',
    component: {
      props: ['value'],
      render(h) {
        return (
          <el-cascader
            placeholder='请选分类'
            options={this.categoryList}
            props={{
              props: {
                value: 'id',
                label: '__toString',
                checkStrictly: true
              }
            }}
            on-change={e => {
              this.$emit('input', e[e.length - 1])
            }}
            filterable
          ></el-cascader>
        )
      },
      data() {
        return {
          categoryList: []
        }
      },
      created() {
        const params = {
          '@filter': 'entity.getType().getSlug() == "services"'
        }
        this.$api.get('/api/categories', { params }).then(res => {
          this.categoryList = res.data.map(e => ({
            __toString: e.name,
            ...e
          }))
        })
      }
    }
  }
]

export const formConfig = [
  {
    property: 'category',
    component: {
      props: ['form'],
      render(h) {
        return (
          <el-cascader
            placeholder='搜索'
            options={this.categoryList}
            props={{
              props: { value: 'id', label: '__toString', checkStrictly: true }
            }}
            on-change={e => {
              this.form.category = e[e.length - 1]
            }}
            filterable
          ></el-cascader>
        )
      },
      data() {
        return {
          categoryList: []
        }
      },
      created() {
        const params = {
          '@filter': 'entity.getType().getSlug() == "services"'
        }
        this.$api.get('/manage/categories', { params }).then(res => {
          this.categoryList = res.data.map(e => ({
            __toString: e.name,
            ...e
          }))
        })
      }
    }
  },
  { property: 'region', component: Region() },
  'price'
]

export default {
  querierConfig,

  tableConfig: ['id', 'category', 'region', 'price'],

  formConfig,

  uploadValidator: {
    title: '导入区域价钱',
    filename: '区域价钱模板',
    fields: {
      region: '地区ID',
      regionName: '地区名',
      category: '分类ID',
      categoryName: '分类名称',
      price: '价格'
    },
    rules: {
      region: [
        { type: 'number', message: '地区ID必须为数字' },
        { required: true, message: '地区ID必须填写' }
      ],
      category: [
        { type: 'number', message: '分类ID必须为数字' },
        { required: true, message: '分类ID必须填写' }
      ],
      price: [
        { type: 'number', message: '价格必须为数字' },
        { required: true, message: '价格必须填写' },
        {
          validator: (rule, value, callback) => {
            if (value >= 0) {
              callback()
            } else {
              callback(new Error('价格必须为正数'))
            }
          }
        }
      ]
    },
    uploadFunc(excelData) {
      return new Promise((resolve, reject) => {
        const waitPromise = []
        excelData.forEach(e => {
          waitPromise.push(this.$api.post('/manage/region-special-prices', e))
        })
        Promise.all(waitPromise)
          .then(() => {
            resolve()
          })
          .catch(() => {
            reject()
          })
      })
    },
    async downloadFunc() {
      const region = this.$store.getters?.regionList.find(
        e => e.id === this.componentData.region
      )
      if (!region) {
        this.$message.error('请选择地区')
        this.downloadLoading = false
        return
      }

      const params = {
        '@filter': 'entity.getType().getSlug() == "services"'
      }
      const res = await this.$api.get('/manage/categories', { params })

      const resData = res.data.filter(e => e.children.length === 0)

      const excel = await import('@/vendor/Export2Excel')
      const filterVal = Object.keys(this.fields)
      const data = formatFunc(filterVal, resData)
      excel.export_json_to_excel({
        header: Object.values(this.fields),
        data,
        filename: region.name + this.filename
      })

      return

      function formatFunc(filterVal, jsonData) {
        return jsonData.map(v =>
          filterVal.map(j => {
            switch (j) {
              case 'regionName':
                return region.name
              case 'region':
                return region.id
              case 'categoryName':
                return v.name
              case 'category':
                return v.id
              default:
                break
            }
          })
        )
      }
    },
    component: RegionUpload({ checkStrictly: true })
  }
}
