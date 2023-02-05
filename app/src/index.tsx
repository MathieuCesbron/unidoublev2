import ReactDOM from "react-dom/client";
import { WalletContext } from "./components/Navbar/WalletContext";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <WalletContext>
      <App />
    </WalletContext>
  </BrowserRouter>,
);
