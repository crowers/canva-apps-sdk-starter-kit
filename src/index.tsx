import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import { AppI18nProvider } from "@canva/app-i18n-kit";

// Get the root element from the DOM
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

const root = createRoot(rootElement);
function render() {
  root.render(
    <AppI18nProvider>
      <AppUiProvider>
        <App />
      </AppUiProvider>
    </AppI18nProvider>
  );
}

render();

// Enable hot module replacement if available
if (module.hot) {
  module.hot.accept("./app", render);
}


function getLocale() {
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

  // Check if the locale is supported by Canva
  if (!availableLocales.includes(locale.substring(0, 2))) {
    locale = 'en';
  }
  return locale;
}