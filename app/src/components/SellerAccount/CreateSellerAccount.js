import { useState } from "react";
import { curve } from "../../utils/crypto/crypto";
import {
  program,
  storePubKey,
  connection,
  privateConnection,
} from "../../utils/solana/program";
import solanaLogo from "../../images/solana-logo.png";
import * as anchor from "@project-serum/anchor";
import shadowLogo from "../../images/shadow-logo.png";
import plusLogo from "../../images/plus-logo.png";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import useStore from "../../store";
import CreateSellerAccountSummary from "./CreateSellerAccountSummary";
import CreateSellerAccountStep1 from "./CreateSellerAccountStep1";
import CreateSellerAccountStep2 from "./CreateSellerAccountStep2";
import CreateSellerAccountStep3 from "./CreateSellerAccountStep3";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import "./CreateSellerAccount.css";

const CreateSellerAccount = () => {
  // const { publicKey } = useWallet();
  const wallet = useAnchorWallet();

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);

  const { connection } = useConnection();

  const sellerDiffieKeyPair = curve.genKeyPair();
  const sellerDiffiePubKey = sellerDiffieKeyPair
    .getPublic()
    .encode("hex", false);
  const sellerDiffiePrivKey = sellerDiffieKeyPair.getPrivate().toString("hex");

  const shdw_hash = "7o69nEJC5rkJYoT2eceCqECJA8nv5BzrbeDaRVX7Zsgi";

  const setIsSeller = useStore((state) => state.setIsSeller);

  async function createSellerAccountHandler() {
    try {
      const drive = await new ShdwDrive(privateConnection, wallet).init();
      // 1 SHDW token is 4GB.
      const { shdw_bucket, transaction_signature } =
        await drive.createStorageAccount("unidouble", "4GB", "v2");
      console.log(shdw_bucket, transaction_signature);
    } catch (error) {
      console.log(error);
    }

    // const [sellerAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [publicKey.toBuffer()],
    //   program.programId,
    // );

    // try {
    //   const txInitSellerAccount = await program.methods
    //     .initSellerAccount(sellerDiffiePubKey, shdw_hash)
    //     .accounts({
    //       user: publicKey,
    //       store: storePubKey,
    //       sellerAccount: sellerAccount,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //     })
    //     .rpc();
    //   setIsSeller(true);
    //   console.log("tx init seller account: ", txInitSellerAccount);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  const StepToPage = () => {
    switch (step) {
      case 0:
        return <CreateSellerAccountSummary setStep={setStep} />;
      case 1:
        return <CreateSellerAccountStep1 setStep={setStep} />;
      case 2:
        return <CreateSellerAccountStep2 setStep={setStep} />;
      case 3:
        return <CreateSellerAccountStep3 setStep={setStep} />;
      default:
        return <div>Should never happen</div>;
    }
  };

  return (
    <div className="create-wrapper">
      <div className="create">
        {step != 0 && (
          <ProgressBar percent={(step - 1) * 50}>
            <Step>
              {({ accomplished, index }) => (
                <div
                  className={`indexedStep ${
                    accomplished ? "accomplished" : null
                  }`}
                >
                  {index + 1}
                </div>
              )}
            </Step>
            <Step>
              {({ accomplished, index }) => (
                <div
                  className={`indexedStep ${
                    accomplished ? "accomplished" : null
                  }`}
                >
                  {index + 1}
                </div>
              )}
            </Step>
            <Step>
              {({ accomplished, index }) => (
                <div
                  className={`indexedStep ${
                    accomplished ? "accomplished" : null
                  }`}
                >
                  {index + 1}
                </div>
              )}
            </Step>
          </ProgressBar>
        )}
        <StepToPage />
      </div>
    </div>
    //   <div className="create-wrapper">
    //     <div className="create">
    //       {/* <p>
    //         <a
    //           className="create-link"
    //           href="https://www.shadow.cloud/"
    //           target="_blank"
    //         >
    //           Shadow Cloud
    //         </a>
    //         &nbsp;has been chosen by Unidouble to provide a decentralized storage
    //         linked to the Solana blockchain. It is used to store images of items
    //         listed for example.
    //       </p>
    //       <p>
    //         <a
    //           className="create-link"
    //           href="https://phantom.app/blog/swapping-tokens"
    //           target="_blank"
    //         >
    //           You can use the Phantom wallet to swap SOL for some SHDW tokens.
    //         </a>
    //       </p> */}
    //       {/* The seller account creation is in 3 steps and take less than 1 minute to
    //       do ! */}
    //       {/* <p>
    //         This is your private key, save this somewhere safe, we won't show this
    //         to you ever again. It will be needed to decode the sales you make.
    //       </p> */}
    //     </div>
    //   </div>
  );
};

export default CreateSellerAccount;
