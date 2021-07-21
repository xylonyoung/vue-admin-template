import { roles } from '@/config/settings'
import { getRole } from '@/utils/auth'

export default function() {
  const role = roles.find(e => e.value === getRole())
  if (role) {
    return `/${role.value}/`
  }

  return '/manage/'
}
