import solanaLogo from "../../images/solana-logo.png";
import plusLogo from "../../images/plus-logo.png";
import shadowLogo from "../../images/shadow-logo.png";
import { Button } from "antd";
import "./CreateAccountSummary.css";

const CreateBuyerAccountSummary = ({ setStep }) => {
  const startBuyerAccountCreationHandler = () => {
    setStep(1);
  };

  return (
    <>
      <h1 className="create-title">Create buyer account</h1>
      <p>
        It costs less than 1$ to be able to buy items on Unidouble, you can
        delete the account when you want. The buyer account creation is in 2
        steps and takes less than 1 minute to do !
      </p>
      <ol className="create-list">
        <li>Create the decentralized storage account</li>
        <li>Create buyer account on Solana</li>
      </ol>
      <h3 className="total-cost">Total cost: </h3>
      <p className="cost">
        <img className="token-logo" src={solanaLogo} alt="solana token logo" />
        0.00187 SOL
        <img className="plus-logo" src={plusLogo} alt="plus logo" />
        <img className="token-logo" src={shadowLogo} alt="shadow token logo" />1
        SHDW Token
      </p>
      <Button
        type="primary"
        size="large"
        onClick={startBuyerAccountCreationHandler}
      >
        Start buyer account creation
      </Button>
    </>
  );
};

export default CreateBuyerAccountSummary;
