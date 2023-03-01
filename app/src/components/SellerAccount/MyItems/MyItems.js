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
import { TbMoodEmpty } from "react-icons/tb";
import { Pagination } from "antd";
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
  const lastItemIndex = currentPage * myItemsPerPage;
  const firstItemIndex = lastItemIndex - myItemsPerPage;
  const currentMyItems = decodedMyItems.slice(firstItemIndex, lastItemIndex);

  useEffect(() => {
    (async () => {
      const mi = await getMyItems(publicKey);
      const dmi = getDecodedItems(mi);
      const smi = dmi.sort((a, b) => b.score - a.score);
      setDecodedMyItems(smi);

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
      {!loading &&
        (currentMyItems.length !== 0 ? (
          <>
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
            <Pagination
              style={{ textAlign: "center" }}
              hideOnSinglePage
              current={currentPage}
              pageSize={myItemsPerPage}
              total={decodedMyItems.length}
              onChange={(value) => {
                setCurrentPage(value);
                window.scrollTo(0, 0);
              }}
            />
          </>
        ) : (
          <div className="option-empty-wrapper">
            <TbMoodEmpty size={"5em"} />
            <p className="option-empty">You have no items listed yet...</p>
          </div>
        ))}
    </div>
  );
};

export default MyItems;
