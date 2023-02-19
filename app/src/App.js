import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import SearchResult from "./components/Search/SearchResult";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import BuyerAccount from "./components/BuyerAccount/BuyerAccount";
import SellerAccount from "./components/SellerAccount/SellerAccount";
import CreateSellerAccount from "./components/CreateAccount/CreateSellerAccount";
import CreateBuyerAccount from "./components/CreateAccount/CreateBuyerAccount";
import ItemResult from "./components/Search/ItemResult";
import "./App.css";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route
          path="/create-seller-account"
          element={<CreateSellerAccount />}
        />
        <Route path="/create-buyer-account" element={<CreateBuyerAccount />} />
        <Route path="/seller-account" element={<SellerAccount />} />
        <Route path="/buyer-account" element={<BuyerAccount />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/item/:unique_number" element={<ItemResult />} />
      </Routes>
    </>
  );
};

export default App;
