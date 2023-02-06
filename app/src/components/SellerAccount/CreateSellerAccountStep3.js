import solanaLogo from "../../images/solana-logo.png";

const CreateSellerAccountStep3 = () => {
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
        0.001 SOL
      </p>
      <button className="step-btn">Approve transaction on wallet</button>
    </div>
  );
};

export default CreateSellerAccountStep3;
