import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createContext, useContext } from "react";
import UserStore from "./store/UserStore";
import DeviceStore from "./store/DeviceStore";

interface ContextInterface {
  user: UserStore;
  device: DeviceStore;
}
const Context = createContext<Partial<ContextInterface>>({});
export const useUserContext = () => useContext(Context);

const root = createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <Context.Provider
    value={{
      user: new UserStore(),
      device: new DeviceStore(),
    }}
  >
    <App />
  </Context.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

reportWebVitals();
