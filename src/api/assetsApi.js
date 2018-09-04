import fetch from '../utils/fetch'
export default {
    //获取用户资产信息
    balance() { return fetch.fetch('/asset/getAssetAccount', {}, 'get') },
    //获取货币信息
    currencyList() { return fetch.fetch('common/queryCurrency', {}, 'get') },
    //货币对照价格
    currencyPrice() { return fetch.fetch('common/exchange/coins', {}, 'get') },
    //美元汇率
    exchangeList() { return fetch.fetch('common/exchange/list', {}, 'get') },
}