import "@/assets/styles/tailwind.css";
import "@/assets/styles/main.scss";

import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./stores";
import UserService from "./keycloak/userService.ts";

const renderApp = () =>
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>
      <App />
    </Provider>
  );

UserService.initKeycloak(renderApp);
