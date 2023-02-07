import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { program, storePubKey } from "../../utils/solana/program";
import * as anchor from "@project-serum/anchor";
import solanaLogo from "../../images/solana-logo.png";
import useStore from "../../store";

const CreateSellerAccountStep3 = ({ sellerDiffiePubKey }) => {
  const { publicKey } = useWallet();

  const [error, setError] = useState("");

  const setIsSeller = useStore((state) => state.setIsSeller);
  const shdwBucket = useStore((state) => state.shdwBucket);

  const createSellerAccountHandler = async () => {
    setError("");
    const [sellerAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [publicKey.toBuffer()],
      program.programId,
    );

    try {
      const txInitSellerAccount = await program.methods
        .initSellerAccount(sellerDiffiePubKey, shdwBucket)
        .accounts({
          user: publicKey,
          store: storePubKey,
          sellerAccount: sellerAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      setIsSeller(true);
      console.log("tx init seller account: ", txInitSellerAccount);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <div>
      <h2 className="step-title">Create Seller Account</h2>
      <p>
        This is the last step, your account will be registred on Solana. you
        will be able to list items and hopefully make sales after that !
      </p>
      <h3 className="total-cost">Cost: </h3>
      <p className="cost">
        <img className="token-logo" src={solanaLogo} alt="solana token logo" />
        0.00231 SOL
      </p>
      <button className="step-btn" onClick={createSellerAccountHandler}>
        Approve transaction on wallet
      </button>
      <p className="step-error">
        {error &&
          "Error while creating the seller account, are you sure you have enough funds ?"}
      </p>
    </div>
  );
};

export default CreateSellerAccountStep3;
