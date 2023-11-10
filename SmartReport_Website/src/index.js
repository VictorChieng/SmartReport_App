import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { UserProvider } from './components/UserContext'; // Import the UserProvider from your UserContext

import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider> {/* Wrap your entire app with the UserProvider */}
      <App />
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);


// import React from "react"
// import ReactDOM from "react-dom"
// import App from "./components/App"
// import "bootstrap/dist/css/bootstrap.min.css"

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById("root")
// )
