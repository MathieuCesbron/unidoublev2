import { useWallet } from "@solana/wallet-adapter-react";
import HomeConnectWallet from "../../images/home-connect-wallet.png";
import HomeSellerAccount from "../../images/home-seller-account.png";
import HomeOrders from "../../images/home-orders.png";
import HomeSearchBuy from "../../images/home-search-buy.png";
import HomeSearchItems from "../../images/home-search-items.png";
import HomeSmallScreenBuyer from "../../images/home-small-screen-buyer.png";
import HomeSmallScreenSeller from "../../images/home-small-screen-seller.png";
import HomeCreateAccount from "../../images/home-create-account.png";
import useStore from "../../store";
import "./Home.css";

const Home = () => {
  const { connected } = useWallet();

  const isSeller = useStore((state) => state.isSeller);
  const isBuyer = useStore((state) => state.isBuyer);

  const isNotConnectedWithoutAccount = !connected && !isSeller && !isBuyer;
  const isConnectedWithoutAccount = connected && !isSeller && !isBuyer;

  return (
    <div className="home-wrapper">
      {isSeller && (
        <>
          <img
            className="home-search-items home-big-screen"
            src={HomeSearchItems}
            alt="home-search-items"
          />
          <img
            className="home-seller-account home-big-screen"
            src={HomeSellerAccount}
            alt="home-seller-account"
          />
          <img
            className="home-small-screen"
            src={HomeSmallScreenSeller}
            alt="home-small-screen"
          />
        </>
      )}
      {isBuyer && (
        <>
          <img
            className="home-search-buy home-big-screen"
            src={HomeSearchBuy}
            alt="home-search-buy"
          />
          <img
            className="home-orders home-big-screen"
            src={HomeOrders}
            alt="home-orders"
          />
          <img
            className="home-small-screen"
            src={HomeSmallScreenBuyer}
            alt="home-small-screen"
          />
        </>
      )}
      {isNotConnectedWithoutAccount && (
        <>
          <img
            className="home-search-items home-big-screen"
            src={HomeSearchItems}
            alt="home-search-items"
          />
          <img
            className="home-connect-wallet home-big-screen"
            src={HomeConnectWallet}
            alt="home-connect-wallet"
          />
          <img
            className="home-small-screen"
            src={HomeSmallScreenBuyer}
            alt="home-small-screen"
          />
        </>
      )}
      {isConnectedWithoutAccount && (
        <>
          <img
            className="home-search-items home-big-screen"
            src={HomeSearchItems}
            alt="home-search-items"
          />
          <img
            className="home-create-account home-big-screen"
            src={HomeCreateAccount}
            alt="home-create-account"
          />
          <img
            className="home-small-screen"
            src={HomeSmallScreenBuyer}
            alt="home-small-screen"
          />
        </>
      )}
    </div>
  );
};

export default Home;
