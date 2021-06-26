<template>
  <div class="dashboard-container">
    <admin v-if="role === 'admin'" />
    <user v-else />
  </div>
</template>

<script>
import Admin from './admin.vue'
import User from './user.vue'
import { getRole } from '@/utils/auth'

export default {
  name: 'Dashboard',
  components: { Admin, User },
  data() {
    return {
      role: getRole()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
