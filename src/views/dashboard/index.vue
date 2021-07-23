<template>
  <div class="dashboard-container">
    <manage-component v-if="role === 'manage'" />
  </div>
</template>

<script>
import ManageComponent from './manage.vue'
import { getRole } from '@/utils/auth'

export default {
  name: 'Dashboard',
  components: { ManageComponent },
  data() {
    return {
      role: getRole()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
