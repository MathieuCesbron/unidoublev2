import { useWallet } from "@solana/wallet-adapter-react";
import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { TbMoodEmpty } from "react-icons/tb";
import {
  getOrdersForSeller,
  getDecodedOrders,
} from "../../../utils/solana/account";
import Order from "../../Order/Order";
import "../Option.css";

const SalesItem = () => {
  const { publicKey } = useWallet();

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [decodedOrders, setDecodedOrders] = useState([]);

  const myOrdersPerPage = 5;
  const lastItemIndex = currentPage * myOrdersPerPage;
  const firstItemIndex = lastItemIndex - myOrdersPerPage;
  const currentOrders = decodedOrders.slice(firstItemIndex, lastItemIndex);

  useEffect(() => {
    (async () => {
      const o = await getOrdersForSeller(publicKey);
      const dor = getDecodedOrders(o);

      setDecodedOrders(dor);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      {!loading &&
        (currentOrders.length !== 0 ? (
          <>
            {currentOrders.map((data) => (
              <Order key={data.order_number} orderData={data} mode="sales" />
            ))}
            <Pagination
              style={{ textAlign: "center" }}
              hideOnSinglePage
              current={currentPage}
              pageSize={myOrdersPerPage}
              total={decodedOrders.length}
              onChange={(value) => {
                setCurrentPage(value);
                window.scrollTo(0, 0);
              }}
            />
          </>
        ) : (
          <div className="option-empty-wrapper">
            <TbMoodEmpty size={"5em"} />
            <p className="option-empty">You have made no sales yet.</p>
          </div>
        ))}
    </div>
  );
};

export default SalesItem;
