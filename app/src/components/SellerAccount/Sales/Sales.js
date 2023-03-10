import { IoArrowBackCircleOutline } from "react-icons/io5";
import useStore from "../../../store";
import SalesLogin from "./SalesLogin";
import OrdersSales from "./OrdersSales";
import "../Option.css";

const Sales = (props) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  return (
    <div className="option-wrapper">
      <div className="option-top">
        <IoArrowBackCircleOutline
          className="option-back-arrow"
          size={"2.3em"}
          onClick={() => props.setMode("account")}
        />
        <h2 className="option-title">Sales</h2>
      </div>
      {isAuthenticated ? <OrdersSales /> : <SalesLogin />}
    </div>
  );
};

export default Sales;
