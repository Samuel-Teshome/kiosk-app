import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import am from "./locales/am.json";
import en from "./locales/en.json";
import om from "./locales/om.json";
import ti from "./locales/ti.json";

const STORAGE_KEY = "kioskLanguage";

const supportedLanguages = ["en", "am", "om", "ti"];

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return supportedLanguages.includes(saved) ? saved : "en";
  } catch {
    return "en";
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    am: { translation: am },
    om: { translation: om },
    ti: { translation: ti },
  },

  lng: getSavedLanguage(),
  fallbackLng: "en",

  interpolation: {
    escapeValue: false,
  },

  // Prevent initialization from blocking the app.
  initImmediate: false,
});

export default i18n;
