import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './pages/App';
import reportWebVitals from './reportWebVitals';
import { FluentProvider, teamsLightTheme } from '@fluentui/react-components';
import { Provider as RTXProvider } from 'react-redux'
import { setupStore } from './redux/store'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <FluentProvider theme={teamsLightTheme}>
      <RTXProvider store={setupStore()}>
          <App />
      </RTXProvider>
    </FluentProvider>,
  </React.StrictMode>
);

reportWebVitals();
