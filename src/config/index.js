module.exports = {
  /**
   * @type {String}
   * @description baseURL for @/utils/request.js.
   */
  baseURL: 'http://canteen.gdlangying.com/',

  /**
   * @type {String}
   * @description global title.
   */
  title: 'Vue Admin Template',

  /**
   * @type {Array}
   * @param {string} label
   * @param {string} value
   * @description role also is entity prefix for api.
   */
  roles: [
    { label: '管理员', value: 'manage' },
    { label: '用户', value: 'api' }
  ],

  /**
   * @type {string}
   * @description set default role for login.
   */
  defaultLoginRole: 'api',

  /**
   * @type {boolean}
   * @description user must has permissions property, routes will filter by permissions.
   */
  hasPermission: false,

  /**
   * @type {String}
   * @description public sub-path, see vue.config.js -> publicPath.
   */
  subPath: 'admin',

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
