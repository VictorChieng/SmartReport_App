import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { UserProvider } from './components/UserContext'; // Import the UserProvider from  UserContext

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider> {/* Wrap  entire app with the UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


