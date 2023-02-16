import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import SellerAccountOptions from "./components/SellerAccount/SellerAccountOptions";
import Home from "./components/Home/Home";
import SearchResult from "./components/Search/SearchResult";
import "./App.css";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller-account" element={<SellerAccountOptions />} />
        <Route path="/search" element={<SearchResult />} />
      </Routes>
    </>
  );
};

export default App;
