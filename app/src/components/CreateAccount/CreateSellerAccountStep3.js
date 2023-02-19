import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { program, storePubKey } from "../../utils/solana/program";
import * as anchor from "@project-serum/anchor";
import solanaLogo from "../../images/solana-logo.png";
import useStore from "../../store";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const CreateSellerAccountStep3 = ({ setStep, sellerDiffiePubKey }) => {
  const { publicKey } = useWallet();
  const navigate = useNavigate();

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
      navigate("/seller-account");
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <>
      <div className="step-top">
        <IoArrowBackCircleOutline
          size={"1.5em"}
          className="step-back-icon"
          onClick={() => setStep(2)}
        />
        <h2>Create Seller Account</h2>
      </div>
      <p>
        This is the last step, your account will be registred on Solana. you
        will be able to list items and hopefully make sales after that !
      </p>
      <h3 className="total-cost">Cost: </h3>
      <p className="cost">
        <img className="token-logo" src={solanaLogo} alt="solana token logo" />
        0.00231 SOL
      </p>
      <Button type="primary" size="large" onClick={createSellerAccountHandler}>
        Approve transaction on wallet
      </Button>
      <p className="step-error">
        {error &&
          "Error while creating the seller account, are you sure you have enough funds ?"}
      </p>
    </>
  );
};

export default CreateSellerAccountStep3;
