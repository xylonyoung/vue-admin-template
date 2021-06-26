module.exports = {
  baseURL: 'http://47.106.118.125:8000/',

  // router just return userRoutes width entity prefix.
  // default 'api'
  entityPrefix: 'business',

  // pages need permission or not.
  // user must have permissions property.
  needPermission: false,

  // set public sub-path.
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
