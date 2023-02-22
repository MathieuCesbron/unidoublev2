import { useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Button, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { MdOutlineVpnKey } from "react-icons/md";
import "./Sales.css";
import "../Option.css";

const Sales = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [privateKey, setPrivateKey] = useState("");

  const checkPrivateKey = () => {
    console.log("checked");
    setIsAuthenticated(true);
  };

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
      {isAuthenticated ? (
        <div>gg you are authenticated</div>
      ) : (
        <div className="sales-private-key">
          <div className="sales-top-private-key">
            <MdOutlineVpnKey size="2em" />
            <h3 className="sales-top-enter">
              Enter your private key to access your sales
            </h3>
          </div>
          <Input.Password
            size="large"
            placeholder="private key"
            minLength="62"
            maxLength="63"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
          <Button
            type="primary"
            onClick={checkPrivateKey}
            size="large"
            className="sales-private-key-btn"
          >
            Access sales
          </Button>
        </div>
      )}
    </div>
  );
};

export default Sales;
