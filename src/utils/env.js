/* global process */

/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 */

let baseUrl = '';
if (process.env.NODE_ENV == 'production') {
    baseUrl = '';
} else if (process.env.NODE_ENV == 'cit') {
    // baseUrl = '';
} else {
    // baseUrl = '';
}

export default {
    baseUrl
}
