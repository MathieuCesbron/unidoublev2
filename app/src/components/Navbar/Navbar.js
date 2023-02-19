import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import Search from "./Search";
import unidoubleLogo from "../../images/unidouble-logo.png";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import {
  getSellerAccount,
  getBuyerAccount,
} from "../../utils/solana/sellerAccount";
import useStore from "../../store";
import { Button } from "antd";
import "./Navbar.css";

const Navbar = () => {
  const { connected, publicKey } = useWallet();
  const navigate = useNavigate();

  const isSeller = useStore((state) => state.isSeller);
  const setIsSeller = useStore((state) => state.setIsSeller);

  const isBuyer = useStore((state) => state.isBuyer);
  const setIsBuyer = useStore((state) => state.setIsBuyer);

  const [loading, setLoading] = useState(true);

  // We go back to the home page when the publicKey change.
  // It's the easy solution, we should stay on the page sometimes.
  // TODO: make a better logic when user changes publicKey.
  useEffect(() => {
    setIsBuyer(undefined);
    setIsSeller(undefined);
    navigate("/");
  }, [publicKey]);

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }

    if (!publicKey) {
      return;
    }

    (async () => {
      const sellerAccount = await getSellerAccount(publicKey);
      if (sellerAccount === undefined) {
        setIsSeller(false);
      } else {
        setIsSeller(true);
      }

      const buyerAccount = await getBuyerAccount(publicKey);
      if (buyerAccount === undefined) {
        setIsBuyer(false);
      } else {
        setIsBuyer(true);
      }

      setLoading(false);
    })();
  }, [publicKey]);

  const accountMode = () => {
    if (isSeller === true) {
      navigate("seller-account");
    } else if (isBuyer === true) {
      navigate("buyer-account");
    } else {
      navigate("/create-account");
    }
  };

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
        <Button
          disabled={!connected || loading}
          type="text"
          size="large"
          style={{
            color: "black",
            fontWeight: 600,
            fontSize: "1.3rem",
            padding: "0 1.5em",
          }}
          className="navbar-link"
          onClick={accountMode}
        >
          {isBuyer ? "Orders" : "Account"}
        </Button>
        <WalletMultiButton
          style={{
            backgroundColor: "#f5f9ff",
            border: "black solid 1px",
            color: "black",
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
