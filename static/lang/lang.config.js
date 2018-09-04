import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

/*---------使用语言包-----------*/
const i18n = new VueI18n({
    locale: 'CN',    // 语言标识
    messages: {
        'CN': require('./cn'),   // 中文语言包
        'EN': require('./en')    // 英文语言包
    },
})

export default i18n;
