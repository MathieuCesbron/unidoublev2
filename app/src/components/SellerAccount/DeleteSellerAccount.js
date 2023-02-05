import { useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import * as anchor from "@project-serum/anchor";
import { program, storePubKey } from "../../utils/solana/program";
import {
  getDecodedSellerAccount,
  getSellerAccount,
} from "../../utils/solana/sellerAccount";
import { useNavigate } from "react-router-dom";

const DeleteSellerAccount = () => {
  const [isSure, setIsSure] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sellerAccount, setSellerAccount] = useState();

  const { publicKey } = useWallet();

  const navigate = useNavigate();

  useEffect(() => {
    const checkSellerAccount = async () => {
      const sa = await getSellerAccount(publicKey);
      const dsa = getDecodedSellerAccount(sa);
      if (dsa.item_count !== 0) {
        setError("remove items before deleting");
      } else {
        setSellerAccount(sa);
      }
      setLoading(false);
    };

    checkSellerAccount();
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
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <h2>Delete seller account</h2>
      <p>
        You can only delete your seller account when you have removed all your
        items. 0.00187 SOL will be credited back to your account.
      </p>
      <input
        className="checkbox"
        type="checkbox"
        id="isSure"
        checked={isSure}
        onChange={() => setIsSure((prevIsSure) => !prevIsSure)}
      />
      <label htmlFor="isSure">I want to delete my seller account</label>
      <p>{error}</p>
      <button
        disabled={!isSure || loading || !sellerAccount}
        onClick={deleteSellerAccountHandler}
      >
        Validate transaction on wallet
      </button>
    </div>
  );
};

export default DeleteSellerAccount;
