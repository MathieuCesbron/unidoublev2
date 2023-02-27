import { useEffect, useState } from "react";
import useStore from "../../store";
import {
  getDecodedItems,
  getItemsByCategory,
} from "../../utils/solana/account";
import Item from "../Item/Item";
import { TbMoodEmpty } from "react-icons/tb";
import { Pagination } from "antd";
import "../SellerAccount/Option.css";

const SearchResult = () => {
  const category = useStore((state) => state.category);

  const [loading, setLoading] = useState(true);
  const [decodedItems, setDecodedItems] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const lastItemIndex = currentPage * itemsPerPage;
  const firstItemIndex = lastItemIndex - itemsPerPage;
  const currentItems = decodedItems.slice(firstItemIndex, lastItemIndex);

  useEffect(() => {
    (async () => {
      const items = await getItemsByCategory(category);
      const di = getDecodedItems(items);
      setDecodedItems(di);
      setLoading(false);
    })();
  }, [category]);

  return (
    <div className="option-wrapper">
      <div className="option-top">
        <h2 className="option-title">Category {category.label}</h2>
      </div>
      {!loading &&
        (currentItems.length !== 0 ? (
          <>
            {currentItems.map((data) => (
              <Item itemData={data} key={data.unique_number} mode={"search"} />
            ))}
            <Pagination
              style={{ textAlign: "center" }}
              hideOnSinglePage
              current={currentPage}
              pageSize={itemsPerPage}
              total={decodedItems.length}
              onChange={(value) => {
                setCurrentPage(value);
                window.scrollTo(0, 0);
              }}
            />
          </>
        ) : (
          <div className="option-empty-wrapper">
            <TbMoodEmpty size={"5em"} />
            <p className="option-empty">No items listed here yet...</p>
          </div>
        ))}
    </div>
  );
};

export default SearchResult;
