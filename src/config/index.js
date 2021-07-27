module.exports = {
  baseURL: 'http://canteen.gdlangying.com/',

  /**
   * @type {Array}
   * @param {string} label
   * @param {string} value
   * @description role also is entity prefix for api.
   */
  roles: [{ label: '管理员', value: 'manage' }],

  /**
   * @type {string}
   * @description set default role for login.
   */
  defaultLoginRole: 'business',

  /**
   * @type {boolean}
   * @description user must has permissions property, routes will filter by permissions.
   */
  hasPermission: false,

  /**
   * @type {String}
   * @description set public sub-path.
   */
  subPath: 'admin',

  title: 'Vue Admin Template',

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: false,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: false
}
