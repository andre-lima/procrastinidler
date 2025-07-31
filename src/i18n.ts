import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import upgradesEn from './locales/en/upgrades.json';
import commonEn from './locales/en/common.json';

import intervalPlural from 'i18next-intervalplural-postprocessor';

intervalPlural.setOptions({
  // these are the defaults
  intervalSeparator: ';',
  intervalRegex: /\((\S*)\).*?\[((.|\n)*)\]/, // pre 3.0 /\((\S*)\).*{((.|\n)*)}/,
  intervalSuffix: '_interval',
});

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    upgrades: upgradesEn,
    common: commonEn,
    // statistics: statisticsEn,
    // generators: generatorsEn,
    // settings: settingsEn,
    // purchase: purchaseEn,
    // menus: menusEn,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(intervalPlural)
  .init({
    resources,
    lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    debug: import.meta.env.VITE_IS_PROD === 'true',
    defaultNS: 'common',
    ns: [
      'common',
      'upgrades',
      // 'statistics',
      // 'generators',
      // 'settings',
      // 'purchase',
      // 'menus',
    ],
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
