const CreateSellerAccountStep1 = ({ setStep }) => {
  return (
    <div>
      <div>
        <h2>Create the decentralized storage account</h2>
      </div>
      <button onClick={() => setStep(2)}>Create decentralized storage</button>
    </div>
  );
};

export default CreateSellerAccountStep1;
