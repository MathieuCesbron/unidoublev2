const CreateSellerAccountStep2 = ({ setStep }) => {
  return (
    <div>
      <h2>Save the private key somewhere safe</h2>
      <button onClick={() => setStep(3)}>I saved the private key</button>
    </div>
  );
};

export default CreateSellerAccountStep2;
