import { useEffect, useState } from "react";
import CreateSellerAccount from "./Create/CreateSellerAccount";
import SellerAccount from "./SellerAccount";
import { getSellerAccount } from "../../utils/solana/sellerAccount";
import { useWallet } from "@solana/wallet-adapter-react";
import { useNavigate } from "react-router-dom";
import useStore from "../../store";

const SellerAccountOptions = () => {
  const { publicKey, connected } = useWallet();

  const isSeller = useStore((state) => state.isSeller);
  const setIsSeller = useStore((state) => state.setIsSeller);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!connected) {
      navigate("/");
    }

    if (!publicKey) {
      return;
    }

    const getSellerAccountWrapper = async () => {
      const sellerAccount = await getSellerAccount(publicKey);
      if (sellerAccount === undefined) {
        setIsSeller(false);
      } else {
        setIsSeller(true);
      }
      setLoading(false);
    };

    getSellerAccountWrapper();
  }, [publicKey]);

  return (
    <>{!loading && (isSeller ? <SellerAccount /> : <CreateSellerAccount />)}</>
  );
};

export default SellerAccountOptions;
