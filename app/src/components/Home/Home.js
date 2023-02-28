import { useWallet } from "@solana/wallet-adapter-react";
import HomeRight from "../../images/home-right.png";
import HomeSellerAccount from "../../images/home-seller-account.png";
import HomeOrders from "../../images/home-orders.png";
import HomeSearchBuy from "../../images/home-search-buy.png";
import HomeSearchItems from "../../images/home-search-items.png";
import HomeSmallScreenBuyer from "../../images/home-small-screen-buyer.png";
import HomeSmallScreenSeller from "../../images/home-small-screen-seller.png";
import useStore from "../../store";
import "./Home.css";

const Home = () => {
  const { connected } = useWallet();

  const isSeller = useStore((state) => state.isSeller);
  const isBuyer = useStore((state) => state.isBuyer);

  return (
    <div className="home-wrapper">
      {isSeller ? (
        <img
          className="home-search-items home-big-screen"
          src={HomeSearchItems}
        />
      ) : (
        <img className="home-search-buy home-big-screen" src={HomeSearchBuy} />
      )}
      {!connected && (
        <img className="home-connect-wallet home-big-screen" src={HomeRight} />
      )}
      {isSeller && (
        <img
          className="home-seller-account home-big-screen"
          src={HomeSellerAccount}
        />
      )}
      {isBuyer && (
        <img className="home-orders home-big-screen" src={HomeOrders} />
      )}
      {/* small screen */}
      {isSeller ? (
        <img className="home-small-screen" src={HomeSmallScreenSeller} />
      ) : (
        <img className="home-small-screen" src={HomeSmallScreenBuyer} />
      )}
    </div>
  );
};

export default Home;
