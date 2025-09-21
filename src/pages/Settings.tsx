import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const Settings = () => {
  const { t, i18n } = useTranslation()
  const [language, setLanguage] = useState(i18n.language)

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    i18n.changeLanguage(lang)
  }

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50 pt-20">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t('settings.title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('settings.subtitle')}
          </p>
        </div>

        <div className="card-elegant p-8 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
            <span>⚙️</span>
            <span>{t('settings.general')}</span>
          </h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('settings.language')}
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                    language === lang.code
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 text-gray-700'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">{lang.flag}</div>
                    <div className="font-medium">{lang.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 mb-4">{t('settings.comingSoon')}</p>
            <button className="btn-primary">
              {t('settings.saveChanges')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings