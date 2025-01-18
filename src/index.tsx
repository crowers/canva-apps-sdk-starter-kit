import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { IntlProvider } from 'react-intl';
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";

// Set up locales - use all locales supported by Canva
const availableLocales = ['en', 'de', 'es', 'fr', 'pt', 'ja', 'ko', 'id'];

var locale = 'en'; // This can be dynamically set based on user preference or browser settings

// Set locale from canva preference or default to browser locale (2 letter code) falling back to 'en'
if (window.canva && window.canva?.locale) {
  locale = window.canva.locale;
}
else if (navigator.language) {
  locale = navigator.language;
}
else {
  locale = 'en';
}

if (locale.length > 2) {
  locale = locale.substring(0, 2);
}

// Check if the locale is supported by Canva
if (!availableLocales.includes(locale)) {
  locale = 'en';
}

// Assuming you have messages in a JSON file for each locale
import messages_en from './locales/en.json';
import messages_de from './locales/de.json';
import messages_es from './locales/es.json';
import messages_fr from './locales/fr.json';
import messages_pt from './locales/pt.json';
import messages_ja from './locales/ja.json';
import messages_ko from './locales/ko.json';
import messages_id from './locales/id.json';

// Define messages object
const messages = { 
  en: messages_en,
  de: messages_de,
  es: messages_es,
  fr: messages_fr,
  pt: messages_pt,
  ja: messages_ja,
  ko: messages_ko,
  id: messages_id
};

// Get the root element from the DOM
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create the root
const root = createRoot(rootElement);

function render() {
  root.render(
    <IntlProvider locale={locale} messages={messages[locale]}>
      <AppUiProvider>
        <App />
      </AppUiProvider>
    </IntlProvider>
  );
}

render();

// Enable hot module replacement if available
if (module.hot) {
  module.hot.accept("./app", render);
}
