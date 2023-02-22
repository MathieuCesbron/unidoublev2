import { Button, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { MdOutlineVpnKey } from "react-icons/md";
import { useState, useEffect } from "react";
import {
  getDecodedSellerAccount,
  getSellerAccount,
} from "../../../utils/solana/account";
import { useWallet } from "@solana/wallet-adapter-react";
import { curve } from "../../../utils/crypto/crypto";
import useStore from "../../../store";
import "./SalesLogin.css";

const SalesLogin = () => {
  const { publicKey } = useWallet();

  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setDiffiePrivateKey = useStore((state) => state.setDiffiePrivateKey);

  const [privateKeyInput, setPrivateKeyInput] = useState("");

  const [diffiePublicKey, setDiffiePublicKey] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const sa = await getSellerAccount(publicKey);
      const dsa = getDecodedSellerAccount(sa);
      setDiffiePublicKey(dsa.diffie_public_key);
    })();
  });

  const checkPrivateKey = (e) => {
    e.preventDefault();
    setError("");
    const keyPair = curve.keyFromPrivate(privateKeyInput);

    if (
      privateKeyInput &&
      keyPair.getPublic().encode("hex") === diffiePublicKey
    ) {
      setIsAuthenticated(true);
      setDiffiePrivateKey(privateKeyInput);
    }
    setError("Invalid private key");
  };

  return (
    <form className="sales-private-key">
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
        onChange={(e) => {
          setPrivateKeyInput(e.target.value);
          setError("");
        }}
      />
      <Button
        type="primary"
        htmlType="submit"
        onClick={checkPrivateKey}
        size="large"
        className="sales-private-key-btn"
      >
        Access sales
      </Button>
      {error && <p className="sales-private-key-error">{error}</p>}
    </form>
  );
};

export default SalesLogin;
