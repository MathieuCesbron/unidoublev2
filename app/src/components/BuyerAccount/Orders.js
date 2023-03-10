import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import { TbMoodTongue } from "react-icons/tb";
import {
  getOrdersForBuyer,
  getDecodedOrders,
} from "../../utils/solana/account";
import Order from "../Order/Order";
import "../SellerAccount/Option.css";

const Orders = () => {
  const { publicKey, connected } = useWallet();

  const [loading, setLoading] = useState(true);
  const [decodedOrders, setDecodedOrders] = useState([]);

  useEffect(() => {
    if (!connected) return;

    (async () => {
      const o = await getOrdersForBuyer(publicKey);
      const dor = getDecodedOrders(o);
      setDecodedOrders(dor);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="option-wrapper">
      <div className="option-top">
        <h2 className="option-title">Orders</h2>
      </div>
      {!loading &&
        (decodedOrders.length !== 0 ? (
          <>
            {decodedOrders.map((data) => (
              <Order
                key={data.order_number}
                orderData={data}
                setDecodedOrders={setDecodedOrders}
              />
            ))}
          </>
        ) : (
          <div className="option-empty-wrapper">
            <TbMoodTongue size={"5em"} />
            <p className="option-empty">You have no pending orders.</p>
          </div>
        ))}
    </div>
  );
};

export default Orders;
