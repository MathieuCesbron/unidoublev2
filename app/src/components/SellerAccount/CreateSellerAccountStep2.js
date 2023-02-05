import { BiCopy } from "react-icons/bi";

const CreateSellerAccountStep2 = ({ setStep, sellerDiffiePrivateKey }) => {
  return (
    <div>
      <h2 className="step-title">Save the private key somewhere safe</h2>
      <p>
        This is your private key, save this somewhere safe, we won't show this
        to you ever again. It will be needed to decode the sales you make.
      </p>
      <div className="diffie-private-key-wrapper">
        <p className="diffie-private-key">{sellerDiffiePrivateKey}</p>
        <BiCopy size={"2em"} />
      </div>
      <button onClick={() => setStep(3)}>I saved the private key</button>
    </div>
  );
};

export default CreateSellerAccountStep2;
