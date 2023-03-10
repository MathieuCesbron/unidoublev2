import ReactDOM from "react-dom/client";
import { WalletContext } from "./components/Navbar/WalletContext";
import { BrowserRouter } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import "react-step-progress-bar/styles.css";

import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <WalletContext>
      <App />
    </WalletContext>
  </BrowserRouter>,
);
