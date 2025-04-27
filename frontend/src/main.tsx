import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Get the root element from the DOM
const rootElement = document.getElementById('root');

// Ensure the root element exists
if (rootElement) {
  const root = createRoot(rootElement);

  // Render the App component inside StrictMode
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error('Root element not found!');
}