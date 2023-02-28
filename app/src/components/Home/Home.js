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
          />
          <img
            className="home-seller-account home-big-screen"
            src={HomeSellerAccount}
          />
          <img className="home-small-screen" src={HomeSmallScreenSeller} />
        </>
      )}
      {isBuyer && (
        <>
          <img
            className="home-search-buy home-big-screen"
            src={HomeSearchBuy}
          />
          <img className="home-orders home-big-screen" src={HomeOrders} />
          <img className="home-small-screen" src={HomeSmallScreenBuyer} />
        </>
      )}
      {isNotConnectedWithoutAccount && (
        <>
          <img
            className="home-search-items home-big-screen"
            src={HomeSearchItems}
          />
          <img
            className="home-connect-wallet home-big-screen"
            src={HomeConnectWallet}
          />
        </>
      )}
      {isConnectedWithoutAccount && (
        <>
          <img
            className="home-search-items home-big-screen"
            src={HomeSearchItems}
          />
          <img
            className="home-create-account home-big-screen"
            src={HomeCreateAccount}
          />
        </>
      )}
    </div>
  );
};

export default Home;
