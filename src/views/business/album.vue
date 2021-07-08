<template>
  <div class="business-container">
    <div class="tips">提示：请上传1000x400尺寸图片</div>
    <base-form
      save
      :data.sync="formData"
      :entity="entity"
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
      entity: 'Business',
      formData: {},
      formConfig: [{ property: 'pictures', type: 'upload' }]
    }
  },
  mounted() {
    this.getBusiness()
  },
  methods: {
    getBusiness() {
      this.$api.get('/business/albums').then((res) => {
        this.formData = res?.data?.[0] ?? {}
      })
    },
    async formSubmit() {
      const data = {
        pictures: this.formData.pictures,
        title: new Date()
      }
      const id = this.formData.id
      const path = '/business/albums'
      let res
      if (id) {
        res = await this.$api.put(path + `/${id}`, data)
      } else {
        res = await this.$api.post(path, data)
      }

      this.$message.success('修改成功')
      this.formData = res.data
    }
  }
}
</script>
<style lang='scss' scoped>
.business-container {
  width: 640px;
  padding: 48px;
}
.tips {
  padding-bottom: 24px;
  text-align: center;
  font-size: 24px;
}
</style>
