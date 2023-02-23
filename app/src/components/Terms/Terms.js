import { AiOutlineHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import "../SellerAccount/Option.css";
import "./Terms.css";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="option-wrapper">
      <div className="option-top" style={{ justifyContent: "center" }}>
        <AiOutlineHome
          size={"2em"}
          className="home-logo"
          onClick={() => navigate("/")}
        />
        <h2>Terms of use coming soon</h2>
      </div>
    </div>
  );
};

export default Terms;
