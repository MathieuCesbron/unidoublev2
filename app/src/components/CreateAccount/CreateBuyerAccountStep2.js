import solanaLogo from "../../images/solana-logo.png";
import { Button } from "antd";
import { useWallet } from "@solana/wallet-adapter-react";
import * as anchor from "@project-serum/anchor";
import { useState } from "react";
import { program } from "../../utils/solana/program";
import useStore from "../../store";
import "./CreateSellerAccountStep.css";
import { useNavigate } from "react-router-dom";

const CreateBuyerAccountStep2 = () => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const setIsBuyer = useStore((state) => state.setIsBuyer);
  const shdwBucket = useStore((state) => state.shdwBucket);
  console.log(shdwBucket);

  const createBuyerAccountHandler = async () => {
    setError("");

    const [buyerAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        publicKey.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode("buyer")),
      ],
      program.programId,
    );

    try {
      const txInitBuyerAccount = await program.methods
        .initBuyerAccount(shdwBucket)
        .accounts({
          user: publicKey,
          buyerAccount: buyerAccount,
        })
        .rpc();
      setIsBuyer(true);
      console.log("tx init buyer account: ", txInitBuyerAccount);
      navigate("/buyer-account");
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <>
      <div className="step-top">
        <h2>Create Buyer account</h2>
      </div>
      <p>
        This is the last step, you account will be registered on Solana. You
        will be able to buy items after that !
      </p>
      <h3 className="total-cost">Cost: </h3>
      <p className="cost">
        <img className="token-logo" src={solanaLogo} alt="solana token logo" />
        0.00150 SOL
      </p>
      <Button type="primary" size="large" onClick={createBuyerAccountHandler}>
        Approve transaction on wallet
      </Button>
      <p className="step-error">
        {error &&
          "Error while creating the seller account, are you sure you have enough funds ?"}
      </p>
    </>
  );
};

export default CreateBuyerAccountStep2;
