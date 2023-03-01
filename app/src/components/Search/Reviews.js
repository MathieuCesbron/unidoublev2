import { useEffect, useState } from "react";
import { TbMoodEmpty } from "react-icons/tb";
import {
  getDecodedOrders,
  getReviewedOrdersForItem,
} from "../../utils/solana/account";
import Review from "./Review";
import "./Reviews.css";

const Reviews = ({ itemNumber }) => {
  const [reviewsData, setreviewsData] = useState([]);

  useEffect(() => {
    (async () => {
      const o = await getReviewedOrdersForItem(itemNumber);
      const decodedOrders = getDecodedOrders(o);
      setreviewsData(() =>
        decodedOrders.map((order) => ({
          shadowHashBuyer: order.shdw_hash_buyer,
          orderNumber: order.order_number,
        })),
      );
    })();
  }, []);

  return (
    <div>
      <h3 className="reviews-title">Customer Reviews</h3>
      {reviewsData.length !== 0 ? (
        reviewsData.map((reviewData) => (
          <div key={reviewData.orderNumber}>
            <hr className="reviews-line" />
            <Review
              key={reviewData.orderNumber}
              shadowHashBuyer={reviewData.shadowHashBuyer}
              orderNumber={reviewData.orderNumber}
            />
          </div>
        ))
      ) : (
        <div className="reviews-empty">
          <TbMoodEmpty size="30" />
          <p className="reviews-empty-text">No reviews yet</p>
        </div>
      )}
    </div>
  );
};

export default Reviews;
