import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Button, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { MdOutlineVpnKey } from "react-icons/md";
import useStore from "../../../store";
import "./Sales.css";
import "../Option.css";
import {
  getDecodedSellerAccount,
  getSellerAccount,
} from "../../../utils/solana/account";
import { useWallet } from "@solana/wallet-adapter-react";
import { curve } from "../../../utils/crypto/crypto";

const Sales = (props) => {
  const { publicKey } = useWallet();

  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setDiffiePrivateKey = useStore((state) => state.setDiffiePrivateKey);

  const [privateKeyInput, setPrivateKeyInput] = useState("");
  const [diffiePublicKey, setDiffiePublicKey] = useState("");

  const shdwBucket = useStore((state) => state.shdwBucket);

  useEffect(() => {
    (async () => {
      const sa = await getSellerAccount(publicKey);
      const dsa = getDecodedSellerAccount(sa);
      setDiffiePublicKey(dsa.diffie_public_key);
    })();
  });

  const checkPrivateKey = () => {
    const keyPair = curve.keyFromPrivate(privateKeyInput);

    if (keyPair.getPublic().encode("hex") === diffiePublicKey) {
      setIsAuthenticated(true);
      setDiffiePrivateKey(privateKeyInput);
    }
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
              Enter your private key to access sales
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
            value={privateKeyInput}
            onChange={(e) => setPrivateKeyInput(e.target.value)}
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
