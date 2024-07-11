/**
 * 邮箱
 * @param {*} s
 */
export const isEmail = (s) => /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(s)

/**
 * 手机号码
 * @param {*} s
 */
export const isMobile = (s) => /^1[0-9]{10}$/.test(s)

/**
 * 电话号码
 * @param {*} s
 */
export const isPhone = (s) => /^([0-9]{3,4}-)?[0-9]{7,8}$/.test(s)

/**
 * URL地址
 * @param {*} s
 */
export const isURL = (s) => /^http[s]?:\/\/.*/.test(s)
