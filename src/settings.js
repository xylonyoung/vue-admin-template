module.exports = {
  baseURL: 'http://worker.jgj-qrcode.cn/',

  /**
   * @type {Array}
   * @param {string} label
   * @param {string} value
   * @description role also is entity prefix for api.
   */
  roles: [{ label: '供应商', value: 'provider' }],

  /**
   * @type {string}
   * @description set default role for login.
   */
  defaultLoginRole: 'provider',

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
