<template>
  <div class="business-container">
    <base-form
      :data.sync="formData"
      :config="formConfig"
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
      formData: {},
      formConfig: [
        { property: 'departments', label: '部门', type: 'array' },
        { property: 'groups', label: '组别', type: 'array' }
      ]
    }
  },
  created() {
    this.getBusiness()
  },
  methods: {
    getBusiness() {
      this.$api.get('/business/businesses').then((res) => {
        this.formData = res.data
      })
    },
    formSubmit() {
      const data = {
        departments: this.formData.departments,
        groups: this.formData.groups
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
.business-container{
  padding: 48px;
}
</style>
