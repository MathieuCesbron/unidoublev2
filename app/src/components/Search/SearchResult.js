import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import useStore from "../../store";
import {
  getDecodedItems,
  getItemsByCategory,
  getSellerAccount,
} from "../../utils/solana/sellerAccount";
import Item from "../Item/Item";

const SearchResult = () => {
  const { publicKey } = useWallet();

  const category = useStore((state) => state.category);

  const [decodedItems, setDecodedItems] = useState([]);

  useEffect(() => {
    (async () => {
      const items = await getItemsByCategory(category);
      const di = getDecodedItems(items);
      setDecodedItems(di);
    })();
  }, [category]);

  // get the shadow hash
  // useEffect(async () => {
  //   const sa = await getSellerAccount(publicKey);
  //   // setSel
  // }, []);

  return (
    <div>
      <h2>search result</h2>
      {decodedItems.map((data) => (
        <Item itemData={data} key={data.unique_number} />
      ))}
    </div>
  );
};

export default SearchResult;
