import fetch from '../utils/fetch'
export default {
    // 查询用户登录信息
    queryUserInfo() { return fetch.fetch('/users/queryUserInfo', {}, 'get') }
}