import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext.js";
import { AssignmentProvider } from "./context/assignmentContext.js";
ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <AssignmentProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </AssignmentProvider>
    </UserProvider>
  </BrowserRouter>
);
