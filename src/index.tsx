import { AppUiProvider } from "@canva/app-ui-kit";
import { createRoot } from "react-dom/client";
import { IntlProvider } from 'react-intl';
import { App } from "./app";
import "@canva/app-ui-kit/styles.css";
import messages_en from './locales/en.json'; // Assuming you have messages in a JSON file for each locale

const locale = 'en'; // This can be dynamically set based on user preference or browser settings
const messages = { en: messages_en };

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
