import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import useStore from "../../store";
import {
  getDecodedItems,
  getItemsByCategory,
} from "../../utils/solana/account";
import Item from "../Item/Item";
import { TbMoodEmpty } from "react-icons/tb";
import "../SellerAccount/Option.css";

const SearchResult = () => {
  const category = useStore((state) => state.category);

  const [decodedItems, setDecodedItems] = useState([]);

  useEffect(() => {
    (async () => {
      const items = await getItemsByCategory(category);
      const di = getDecodedItems(items);
      setDecodedItems(di);
    })();
  }, [category]);

  return (
    <div className="option-wrapper">
      <div className="option-top">
        <h2>Category {category.label}</h2>
      </div>
      {decodedItems.length !== 0 ? (
        decodedItems.map((data) => (
          <Item itemData={data} key={data.unique_number} mode={"search"} />
        ))
      ) : (
        <div className="option-empty-wrapper">
          <TbMoodEmpty size={"5em"} />
          <p className="option-empty">No items listed here yet...</p>
        </div>
      )}
    </div>
  );
};

export default SearchResult;
