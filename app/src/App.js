import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home/Home";
import SearchResult from "./components/Search/SearchResult";
import CreateAccount from "./components/CreateAccount/CreateAccount";
import Orders from "./components/BuyerAccount/Orders";
import SellerAccount from "./components/SellerAccount/SellerAccount";
import CreateSellerAccount from "./components/CreateAccount/CreateSellerAccount";
import CreateBuyerAccount from "./components/CreateAccount/CreateBuyerAccount";
import ItemResult from "./components/Search/ItemResult";
import Footer from "./components/Footer/Footer";
import Terms from "./components/Terms/Terms";
import { Spin } from "antd";
import useStore from "./store";
import "./App.css";

const App = () => {
  const spinning = useStore((state) => state.spinning);

  return (
    <>
      <div className="content-wrapper">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route
            path="/create-seller-account"
            element={<CreateSellerAccount />}
          />
          <Route
            path="/create-buyer-account"
            element={<CreateBuyerAccount />}
          />
          <Route path="/seller-account" element={<SellerAccount />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/search" element={<SearchResult />} />
          <Route path="/item/:unique_number" element={<ItemResult />} />
          <Route path="terms-of-use" element={<Terms />} />
        </Routes>
      </div>
      <Spin
        className="app-spin"
        // only show the spin after 100ms
        delay="100"
        size="large"
        spinning={spinning}
      />
      <Footer />
    </>
  );
};

export default App;
