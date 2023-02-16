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

  const [sellerAccountPublicKey, setSellerAccountPublicKey] = useState();
  const [shadowHash, setShadowHash] = useState();
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
      const dmi = getDecodedMyItems(mi);
      setDecodedMyItems(
        dmi.map((elem, index) => ({
          ...elem,
          pubkey: mi[index].pubkey,
        })),
      );

      const sa = await getSellerAccount(publicKey);
      setSellerAccountPublicKey(sa.pubkey);

      const dsa = getDecodedSellerAccount(sa);
      setShadowHash(dsa.shdw_hash);
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
            <MyItem
              itemData={data}
              shadowHash={shadowHash}
              salesCount={salesCount}
              salesVolume={salesVolume}
              setDecodedMyItems={setDecodedMyItems}
              sellerAccountPublicKey={sellerAccountPublicKey}
              key={data.number}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyItems;
