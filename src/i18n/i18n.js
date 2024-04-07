import { createI18n } from 'vue-i18n';
import { en } from './en.js';
import { fr } from './fr.js';
import { pt } from './pt.js';

const messages = {
    en: en,
    pt: pt,
    fr: fr
};

const i18n = createI18n({
    legacy: false, // VueI18n v9 requires this to be false
    allowComposition: true,
    locale: navigator.language.split('-')[0],
    fallbackLocale: 'en',
    messages: messages
});

export default i18n;
