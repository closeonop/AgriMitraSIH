import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import pa from './locales/pa.json'
import hi from './locales/hi.json'
import or from './locales/or.json'
import bn from './locales/bn.json'

const resources = {
  en: { translation: en },
  pa: { translation: pa },
  hi: { translation: hi },
  or: { translation: or },
  bn: { translation: bn },
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  })

export default i18n
