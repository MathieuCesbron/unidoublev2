import { useState, useMemo, useEffect } from "react";
import { curve } from "../../utils/crypto/crypto";
import CreateSellerAccountSummary from "./CreateSellerAccountSummary";
import CreateSellerAccountStep1 from "./CreateSellerAccountStep1";
import CreateSellerAccountStep2 from "./CreateSellerAccountStep2";
import CreateSellerAccountStep3 from "./CreateSellerAccountStep3";
import { ProgressBar, Step } from "react-step-progress-bar";
import { useWallet } from "@solana/wallet-adapter-react";
import { ShdwDrive } from "@shadow-drive/sdk";
import { privateConnection } from "../../utils/solana/program";
import useStore from "../../store";
import "./CreateTypeAccount.css";

const CreateSellerAccount = () => {
  const wallet = useWallet();
  const { publicKey } = useWallet();

  const [step, setStep] = useState(0);
  const [skipStep1, setSkipStep1] = useState(false);

  const setShdwBucket = useStore((state) => state.setShdwBucket);

  const sellerDiffieKeyPair = useMemo(() => curve.genKeyPair(), []);
  const sellerDiffiePubKey = useMemo(
    () => sellerDiffieKeyPair.getPublic().encode("hex"),
    [],
  );
  const sellerDiffiePrivateKey = useMemo(
    () => sellerDiffieKeyPair.getPrivate().toString("hex"),
    [],
  );

  useEffect(() => {
    (async () => {
      const drive = await new ShdwDrive(privateConnection, wallet).init();
      const accts = await drive.getStorageAccounts("v2");
      if (accts.length === 1) {
        setShdwBucket(accts[0].publicKey.toString());
        setSkipStep1(true);
      }
    })();
    setStep(0);
  }, [publicKey]);

  const StepToPage = () => {
    switch (step) {
      case 0:
        return <CreateSellerAccountSummary setStep={setStep} />;
      case 1:
        if (skipStep1) setStep(2);
        return <CreateSellerAccountStep1 setStep={setStep} />;
      case 2:
        return (
          <CreateSellerAccountStep2
            setStep={setStep}
            sellerDiffiePrivateKey={sellerDiffiePrivateKey}
          />
        );
      case 3:
        return (
          <CreateSellerAccountStep3
            setStep={setStep}
            sellerDiffiePubKey={sellerDiffiePubKey}
          />
        );
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
  );
};

export default CreateSellerAccount;
