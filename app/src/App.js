import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import SellerAccountOptions from "./components/SellerAccount/SellerAccountOptions";
import Home from "./components/Home/Home";
import "./App.css";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/seller-account" element={<SellerAccountOptions />} />
      </Routes>
    </>
  );
};

export default App;
