import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token, { expires: 7 })
}

export function removeToken() {
  Cookies.remove('role')
  return Cookies.remove(TokenKey)
}

export function getRole() {
  return Cookies.get('role')
}

export function setRole(Role) {
  return Cookies.set('role', Role)
}
