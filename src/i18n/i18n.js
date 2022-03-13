
import {en} from './en'
import Vue from 'vue'
import {fr} from './fr'
import {pt} from './pt'
import VueI18n from 'vue-i18n'
export const messages  = {
    en: en,
    pt: pt,
    fr:fr
}
Vue.use(VueI18n)

let locale = (navigator.userLanguage || navigator.language).split("-")[0]

export default new VueI18n({
    locale: locale,
    fallbackLocale: 'en',
    messages: messages
})