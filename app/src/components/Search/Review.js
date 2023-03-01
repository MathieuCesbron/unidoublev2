import { Rate } from "antd";
import { useEffect, useState } from "react";

const Review = ({ shadowHashBuyer, orderNumber }) => {
  const [reviewRate, setReviewRate] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    fetch(
      `https://shdw-drive.genesysgo.net/${shadowHashBuyer}/review_${orderNumber}.json`,
    )
      .then((res) => res.json())
      .then((resData) => {
        setReviewRate(resData.rate);
        setReviewText(resData.review);
      });
  }, []);

  return (
    <div className="review-wrapper">
      <Rate disabled value={reviewRate} />
      <p>{reviewText}</p>
    </div>
  );
};

export default Review;
