import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
  getDecodedSellerAccount,
  getSellerAccount,
  getMyItems,
  getDecodedItems,
} from "../../../utils/solana/account";
import Item from "../../Item/Item";
import "../Option.css";
import "./MyItems.css";

const MyItems = (props) => {
  const { publicKey } = useWallet();

  const [sellerAccountPublicKey, setSellerAccountPublicKey] = useState();
  const [salesCount, setSalesCount] = useState();
  const [salesVolume, setSalesVolume] = useState();
  const [decodedMyItems, setDecodedMyItems] = useState([]);

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const myItemsPerPage = 5;
  const lastPostIndex = currentPage * myItemsPerPage;
  const firstPostIndex = lastPostIndex - myItemsPerPage;
  const currentMyItems = decodedMyItems.slice(firstPostIndex, lastPostIndex);

  useEffect(() => {
    (async () => {
      const mi = await getMyItems(publicKey);
      const dmi = getDecodedItems(mi);
      setDecodedMyItems(
        dmi.map((elem, index) => ({
          ...elem,
          pubkey: mi[index].pubkey,
        })),
      );

      const sa = await getSellerAccount(publicKey);
      setSellerAccountPublicKey(sa.pubkey);

      const dsa = getDecodedSellerAccount(sa);
      setSalesCount(dsa.sales_count);
      setSalesVolume(dsa.sales_volume);

      setLoading(false);
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
      {!loading && (
        <div className="my-items-wrapper">
          {currentMyItems.map((data) => (
            <Item
              itemData={data}
              salesCount={salesCount}
              salesVolume={salesVolume}
              setDecodedItems={setDecodedMyItems}
              sellerAccountPublicKey={sellerAccountPublicKey}
              key={data.unique_number}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;
