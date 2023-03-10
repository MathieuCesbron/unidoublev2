import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { program, storePubKey } from "../../../utils/solana/program";
import {
  getDecodedSellerAccount,
  getSellerAccount,
} from "../../../utils/solana/account";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import useStore from "../../../store";
import { Button } from "antd";
import "./DeleteSellerAccount.css";

const DeleteSellerAccount = ({ setMode }) => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  const [isSure, setIsSure] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sellerAccount, setSellerAccount] = useState();

  const setIsSeller = useStore((state) => state.setIsSeller);

  useEffect(() => {
    (async () => {
      const sa = await getSellerAccount(publicKey);
      const dsa = getDecodedSellerAccount(sa);
      if (dsa.item_count !== 0) {
        setError(
          "You still have items, remove them before deleting your account",
        );
      } else {
        setSellerAccount(sa);
      }
      setLoading(false);
    })();
  }, [publicKey]);

  async function deleteSellerAccountHandler() {
    try {
      const txDeleteSellerAccount = await program.methods
        .deleteSellerAccount()
        .accounts({
          user: publicKey,
          store: storePubKey,
          sellerAccount: sellerAccount.pubkey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      console.log("tx delete seller account: ", txDeleteSellerAccount);
      setIsSeller("false");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="delete-wrapper">
      <IoArrowBackCircleOutline
        className="back-arrow"
        size={"5em"}
        onClick={() => setMode("account")}
      />
      <h2 className="delete-title">Delete seller account</h2>
      <p>
        You can only delete your seller account when you have removed all your
        items. 0.00231 SOL will be credited back to your account.
      </p>
      <input
        className="checkbox"
        type="checkbox"
        id="isSure"
        checked={isSure}
        onChange={() => setIsSure((prevIsSure) => !prevIsSure)}
      />
      <label className="isSure" htmlFor="isSure">
        I want to delete my seller account
      </label>
      <Button
        disabled={!isSure || error || loading || !sellerAccount}
        onClick={deleteSellerAccountHandler}
        type="primary"
        danger
        style={{ display: "block", margin: "auto" }}
        size="large"
      >
        Validate transaction on wallet
      </Button>
      <p className="delete-error">{error}</p>
    </div>
  );
};

export default DeleteSellerAccount;
