import { useWallet } from "@solana/wallet-adapter-react";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { TbMoodEmpty } from "react-icons/tb";
import {
  getMyItems,
  getDecodedItems,
  getOrdersForSeller,
} from "../../../utils/solana/account";
import Item from "../../Item/Item";
import "../Option.css";

const SalesItem = () => {
  const { publicKey } = useWallet();

  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [decodedMyItems, setDecodedMyItems] = useState([]);

  const myItemsPerPage = 5;
  const lastItemIndex = currentPage * myItemsPerPage;
  const firstItemIndex = lastItemIndex - myItemsPerPage;
  const currentMyItems = decodedMyItems.slice(firstItemIndex, lastItemIndex);

  useEffect(() => {
    // TODO: replace myItems with sales.
    (async () => {
      const mi = await getMyItems(publicKey);
      const dmi = getDecodedItems(mi);
      setDecodedMyItems(
        dmi.map((elem, index) => ({
          ...elem,
          pubkey: mi[index].pubkey,
        })),
      );

      const orders = await getOrdersForSeller(publicKey);
      console.log(orders);

      setLoading(false);
    })();
  }, []);

  return (
    <div>
      {!loading && currentMyItems.length !== 0 ? (
        <>
          {currentMyItems.map((data) => (
            <Item
              itemData={data}
              setDecodedItems={setDecodedMyItems}
              key={data.unique_number}
              mode="sales"
            />
          ))}
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
      )}
    </div>
  );
};

export default SalesItem;
