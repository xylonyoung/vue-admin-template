<template>
  <div class="business-container">
    <base-form
      v-if="showForm"
      :data.sync="formData"
      :entity="entityData"
      :config="formConfig"
      :props="{ 'label-width': '200px' }"
      @submit="formSubmit"
    />
  </div>
</template>
<script>
import BaseForm from '@/components/Base/Form'
export default {
  components: { BaseForm },
  data() {
    return {
      showForm: false,
      entityData: {},
      formData: {},
      formConfig: [
        'canCancelAppointmentHourBefore',
        'canMakeAppointmentHourBefore',
        {
          property: 'allowWeekdays',
          default: [],
          component: {
            props: ['data'],
            render(h) {
              return (
                <el-transfer
                  v-model={this.data.allowWeekdays}
                  data={this.weekList}
                  titles={['未选', '已选']}
                ></el-transfer>
              )
            },
            data() {
              return {
                weekList: [
                  { key: 7, label: '星期日' },
                  { key: 1, label: '星期一' },
                  { key: 2, label: '星期二' },
                  { key: 3, label: '星期三' },
                  { key: 4, label: '星期四' },
                  { key: 5, label: '星期五' },
                  { key: 6, label: '星期六' }
                ]
              }
            }
          }
        },
        { property: 'departments', type: 'array' },
        { property: 'groups', type: 'array' }
      ]
    }
  },
  async created() {
    this.entityData = await this.$store.dispatch('entity/getEntity', 'Business')
    this.getBusiness()
  },
  methods: {
    getBusiness() {
      this.$api.get('/business/businesses').then((res) => {
        this.formData = res.data
        this.showForm = true
      })
    },
    formSubmit() {
      const data = {
        canCancelAppointmentHourBefore:
          this.formData.canCancelAppointmentHourBefore,
        canMakeAppointmentHourBefore:
          this.formData.canMakeAppointmentHourBefore,
        departments: this.formData.departments,
        groups: this.formData.groups,
        allowWeekdays: this.formData.allowWeekdays
      }
      this.$api.put('/business/businesses', data).then((res) => {
        this.$message.success('修改成功')
        this.formData = res.data
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.business-container {
  width: 900px;
  padding: 48px;
}
</style>
