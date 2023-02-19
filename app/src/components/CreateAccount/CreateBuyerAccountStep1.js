import solanaLogo from "../../images/solana-logo.png";
import plusLogo from "../../images/plus-logo.png";
import shadowLogo from "../../images/shadow-logo.png";
import { Button } from "antd";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import useStore from "../../store";
import { useState } from "react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { privateConnection } from "../../utils/solana/program";
import "./CreateSellerAccountStep.css";

const CreateBuyerAccountStep1 = ({ setStep }) => {
  const wallet = useAnchorWallet();

  const setShdwBucket = useStore((state) => state.setShdwBucket);
  const [error, setError] = useState("");

  const createStorageAccount = async () => {
    try {
      setError("");
      const drive = await new ShdwDrive(privateConnection, wallet).init();
      // 1 SHDW token is 4GB.
      const { shdw_bucket, transaction_signature } =
        await drive.createStorageAccount("unidouble_buyer", "4GB", "v2");
      setShdwBucket(shdw_bucket);
      console.log("tx create storage account: ", transaction_signature);
      setStep(2);
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };

  return (
    <div>
      <div>
        <h2 className="step-title">Create a decentralized storage account</h2>
      </div>
      <p>
        <a
          className="create-link"
          href="https://www.shadow.cloud/"
          target="_blank"
        >
          Shadow Cloud
        </a>
        &nbsp;has been chosen by Unidouble to provide a decentralized storage
        linked to the Solana blockchain. It is used to store item reviews for
        example.
      </p>
      <p>
        <a
          className="create-link"
          href="https://phantom.app/blog/swapping-tokens"
          target="_blank"
        >
          You can use the Phantom wallet to swap SOL for SHDW tokens.
        </a>
      </p>
      <h3 className="total-cost">Cost: </h3>
      <p className="cost">
        <img className="token-logo" src={solanaLogo} alt="solana token logo" />
        0.00360 SOL
        <img className="plus-logo" src={plusLogo} alt="plus logo" />
        <img className="token-logo" src={shadowLogo} alt="shadow token logo" />1
        SHDW Token
      </p>
      <Button type="primary" size="large" onClick={createStorageAccount}>
        Approve transaction on wallet
      </Button>
      <p className="step-error">
        {error &&
          "Error while creating the storage account, are you sure you have enough funds ?"}
      </p>
    </div>
  );
};

export default CreateBuyerAccountStep1;
