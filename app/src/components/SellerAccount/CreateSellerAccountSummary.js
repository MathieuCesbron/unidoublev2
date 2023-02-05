import solanaLogo from "../../images/solana-logo.png";
import plusLogo from "../../images/plus-logo.png";
import shadowLogo from "../../images/shadow-logo.png";

import "./CreateSellerAccountSummary.css";

const CreateSellerAccountSummary = ({ setStep }) => {
  return (
    <>
      <h1 className="create-title">Become a Unidouble seller</h1>
      <p>
        It costs less than $1 to start listing items, you can delete the account
        when you want. The seller account creation is in 3 steps and take less
        than 1 minute to do !
      </p>
      <ol className="create-list">
        <li>Create the decentralized storage account</li>
        <li>Save your private key somewhere safe</li>
        <li>Create seller account on Solana</li>
      </ol>
      <h3 className="total-cost">Total cost: </h3>
      <p className="cost">
        <img className="token-logo" src={solanaLogo} alt="solana token logo" />
        0.00187 SOL
        <img className="plus-logo" src={plusLogo} alt="plus logo" />
        <img className="token-logo" src={shadowLogo} alt="shadow token logo" />1
        SHDW Token
      </p>
      <button className="btn-create" onClick={() => setStep(1)}>
        Create seller account
      </button>
    </>
  );
};

export default CreateSellerAccountSummary;
