import { useState } from "react";
import { Tooltip } from "react-tooltip";
import "./CreateSellerAccountStep.css";

const CreateSellerAccountStep2 = ({ setStep, sellerDiffiePrivateKey }) => {
  const [isSure, setIsSure] = useState(false);

  return (
    <div className="step-private-key">
      <h2 className="step-title">Save the private key somewhere safe</h2>
      <p>
        This is your private key, save this somewhere safe, we won't show this
        to you ever again. It will be needed to decode the sales you make.
      </p>
      <div
        className="diffie-private-key-wrapper"
        id="tooltip-anchor-click"
        onClick={() => navigator.clipboard.writeText(sellerDiffiePrivateKey)}
      >
        <p className="diffie-private-key">{sellerDiffiePrivateKey}</p>
        <Tooltip
          anchorId="tooltip-anchor-click"
          content="Copied !"
          events={["click"]}
        />
      </div>
      <div className="check">
        <input
          className="checkbox isSure"
          type="checkbox"
          id="isSure"
          checked={isSure}
          onChange={() => setIsSure((prevIsSure) => !prevIsSure)}
        />
        <label className="isSure" htmlFor="isSure">
          I have copied my private key
        </label>
      </div>
      <button
        className="step-btn"
        disabled={!isSure}
        onClick={() => setStep(3)}
      >
        Next step
      </button>
    </div>
  );
};

export default CreateSellerAccountStep2;
