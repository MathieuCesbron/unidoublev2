import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./CreateAccount.css";

const CreateAccount = () => {
  const navigate = useNavigate();

  return (
    <div className="account-wrapper">
      <h1 className="account-title">Create account</h1>
      <p>
        You can either buy or sell on one account. Dont worry ! You can create
        as many accounts as you want.
      </p>
      <div className="create-account-btns">
        <Button
          className="account-btn"
          type="primary"
          size="large"
          onClick={() => navigate("/create-buyer-account")}
        >
          Create buyer account
        </Button>
        <p>or</p>
        <Button
          className="account-btn"
          type="primary"
          size="large"
          onClick={() => navigate("/create-seller-account")}
        >
          Create seller account
        </Button>
      </div>
    </div>
  );
};

export default CreateAccount;
