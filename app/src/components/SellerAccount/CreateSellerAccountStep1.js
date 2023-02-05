import solanaLogo from "../../images/solana-logo.png";
import plusLogo from "../../images/plus-logo.png";
import shadowLogo from "../../images/shadow-logo.png";
import "./CreateSellerAccountStep.css";

const CreateSellerAccountStep1 = ({ setStep }) => {
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
        linked to the Solana blockchain. It is used to store images of items
        listed for example.
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
        0.00187 SOL
        <img className="plus-logo" src={plusLogo} alt="plus logo" />
        <img className="token-logo" src={shadowLogo} alt="shadow token logo" />1
        SHDW Token
      </p>
      <button className="step-btn" onClick={() => setStep(2)}>
        Approve transaction on wallet
      </button>
    </div>
  );
};

export default CreateSellerAccountStep1;
