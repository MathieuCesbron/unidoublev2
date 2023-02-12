import { useState } from "react";
import { TfiDropbox } from "react-icons/tfi";
import { IoTicketOutline } from "react-icons/io5";
import { CiBoxes } from "react-icons/ci";
import { TiDeleteOutline } from "react-icons/ti";
import DeleteSellerAccount from "./Delete/DeleteSellerAccount";
import ListItem from "./List/ListItem";
import MyItems from "./MyItems/MyItems";
import "./SellerAccount.css";

const SellerAccount = () => {
  const [mode, setMode] = useState("account");

  const deleteSellerAccountHandler = () => {
    setMode("delete");
  };

  const newItemHandler = () => {
    setMode("newItem");
  };

  const salesHandler = () => {
    console.log("sales");
  };

  const myItemsHandler = () => {
    setMode("myItems");
  };

  const SellerAccountMode = () => {
    switch (mode) {
      case "newItem":
        return <ListItem setMode={setMode} />;
      case "myItems":
        return <MyItems setMode={setMode} />;
      case "delete":
        return <DeleteSellerAccount setMode={setMode} />;
      case "account":
        return (
          <div className="seller-account">
            <button
              className="seller-btn btn-new-item"
              onClick={newItemHandler}
            >
              <TfiDropbox size={"2.5em"} />
              <b className="btn-text">New Item</b>
            </button>
            <button className="seller-btn btn-sales" onClick={salesHandler}>
              <IoTicketOutline size={"2.5em"} />
              <b className="btn-text">Sales</b>
            </button>
            <button
              className="seller-btn btn-my-items"
              onClick={myItemsHandler}
            >
              <CiBoxes size={"2.5em"} />
              <b className="btn-text">My Items</b>
            </button>
            <button
              className="seller-btn btn-delete-seller-account"
              onClick={deleteSellerAccountHandler}
            >
              <TiDeleteOutline size={"2.5em"} />
              <b className="btn-text">Delete Account</b>
            </button>
          </div>
        );
    }
  };

  return <SellerAccountMode />;
};

export default SellerAccount;
