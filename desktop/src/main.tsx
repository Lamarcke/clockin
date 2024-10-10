import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import {
    BrowserRouter,
    createBrowserRouter, Route,
    RouterProvider, Routes,
} from "react-router-dom";
import ErrorPage from "./error-page.tsx";



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path={"/"} element={<App />}></Route>
          </Routes>
      </BrowserRouter>
  </React.StrictMode>,
);
