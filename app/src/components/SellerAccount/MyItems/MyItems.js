import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
  getDecodedSellerAccount,
  getSellerAccount,
  getMyItems,
  getDecodedMyItems,
} from "../../../utils/solana/sellerAccount";
import MyItem from "./MyItem";
import "../Option.css";
import "./MyItems.css";

const MyItems = (props) => {
  const { publicKey } = useWallet();

  const [sellerAccount, setSellerAccount] = useState();
  const [decodedMyItems, setDecodedMyItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  const myItemsPerPage = 5;
  const lastPostIndex = currentPage * myItemsPerPage;
  const firstPostIndex = lastPostIndex - myItemsPerPage;
  const currentMyItems = decodedMyItems.slice(firstPostIndex, lastPostIndex);

  useEffect(() => {
    (async () => {
      const mi = await getMyItems(publicKey);
      console.log(mi);

      const dmi = await getDecodedMyItems(mi);
      console.log(dmi);
      setDecodedMyItems(dmi);

      const sa = await getSellerAccount(publicKey);
      setSellerAccount(sa);

      const dsa = getDecodedSellerAccount(sa);
    })();
  }, [publicKey]);

  return (
    <div className="option-wrapper">
      <div className="option-top">
        <IoArrowBackCircleOutline
          className="option-back-arrow"
          size="2.3em"
          onClick={() => props.setMode("account")}
        />
        <h2 className="option-title">My Items</h2>
      </div>
      <div className="my-items-wrapper">
        {currentMyItems.map((data) => (
          <MyItem data={data} />
        ))}
      </div>
    </div>
  );
};

export default MyItems;
