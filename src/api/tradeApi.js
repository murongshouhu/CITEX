import fetch from '../utils/fetch'
// 交易中心API
export default {
    //获取计价货币
    getQueryAccountCurrency() { return fetch.fetch('/common/queryQuotedCurrency', '', 'get') },
    //获取交易对信息
    getQueryContract() { return fetch.fetch('/common/queryContract', '', 'get') },
    //获取所有交易对行情
    getQueryIndicatorList() { return fetch.fetch('/quot/queryIndicatorList', '', 'get') },
    //查询用户可用资金
    getQueryAccBalance() { return fetch.fetch('/order/queryAccBalance', '', 'get') },
    //获取自选列表
    getQueryFavoriteList(){return fetch.fetch('/order/cash/queryFavoriteList','','get')},
    //增加自选
    addFavorite(p){return fetch.fetch('/order/cash/addFavorite',p,'get')},
    //取消自选
    deleteFavorite(p){return fetch.fetch('/order/cash/deleteFavorite',p,'get')},
}