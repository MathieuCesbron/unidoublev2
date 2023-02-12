import { IoArrowBackCircleOutline } from "react-icons/io5";
import "../Option.css";
import "./MyItems.css";

const MyItems = (props) => {
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
    </div>
  );
};

export default MyItems;
