import { useEffect, useState } from "react";
import { ProgressBar, Step } from "react-step-progress-bar";
import CreateBuyerAccountStep1 from "./CreateBuyerAccountStep1";
import CreateBuyerAccountSummary from "./CreateBuyerAccountSummary";
import useStore from "../../store";
import { privateConnection } from "../../utils/solana/program";
import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import CreateBuyerAccountStep2 from "./CreateBuyerAccountStep2";
import "./CreateTypeAccount.css";

const CreateBuyerAccount = () => {
  const wallet = useWallet();

  const [step, setStep] = useState(0);
  const [skipStep1, setSkipStep1] = useState(false);

  const setShdwBucket = useStore((state) => state.setShdwBucket);

  useEffect(() => {
    (async () => {
      const drive = await new ShdwDrive(privateConnection, wallet).init();
      const accts = await drive.getStorageAccounts("v2");
      if (accts) {
        setShdwBucket(accts[0].publicKey.toString());
        setSkipStep1(true);
      }
    })();
  });

  const StepToPage = () => {
    switch (step) {
      case 0:
        return <CreateBuyerAccountSummary setStep={setStep} />;
      case 1:
        if (skipStep1) setStep(2);
        return <CreateBuyerAccountStep1 setStep={setStep} />;
      case 2:
        return <CreateBuyerAccountStep2 setStep={setStep} />;
    }
  };

  return (
    <div className="create-wrapper">
      <div className="create">
        {step != 0 && (
          <ProgressBar percent={(step - 1) * 100}>
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

export default CreateBuyerAccount;
