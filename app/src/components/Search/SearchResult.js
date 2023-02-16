import { useEffect, useState } from "react";
import useStore from "../../store";
import {
  getDecodedMyItems,
  getItemsByCategory,
} from "../../utils/solana/sellerAccount";

const SearchResult = () => {
  const category = useStore((state) => state.category);

  const [itemsRendered, setItemsRendered] = useState([]);

  useEffect(() => {
    (async () => {
      const items = await getItemsByCategory(category);
      console.log(items);
      console.log(getDecodedMyItems(items));
    })();
  });

  return <div>search result</div>;
};

export default SearchResult;
