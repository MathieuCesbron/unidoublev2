import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Search from "./Search";
import unidoubleLogo from "../../images/unidouble-logo.png";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";

const Navbar = () => {
  const { connected } = useWallet();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <img
        src={unidoubleLogo}
        alt="unidouble-logo"
        className="unidouble-logo"
        onClick={() => navigate("/")}
      />
      <div className="search-wrapper">
        <Search />
      </div>
      <div className="buttons-wrapper">
        <button
          disabled={!connected}
          className="a-left"
          onClick={() => navigate("/seller-account")}
        >
          Seller account
        </button>
        <button disabled={!connected} className="a-right">
          Orders
        </button>
        <WalletMultiButton />
      </div>
    </nav>
  );
};

export default Navbar;
