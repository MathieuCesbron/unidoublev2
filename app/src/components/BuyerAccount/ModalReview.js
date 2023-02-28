import { ShdwDrive } from "@shadow-drive/sdk";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Modal, Rate } from "antd";
import { useState } from "react";
import {
  privateConnection,
  program,
  storePubKey,
  store_ata,
  USDC_MINT,
} from "../../utils/solana/program";
import useStore from "../../store";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import "./ModalReview.css";

const ModalReview = ({
  setShowModalReview,
  title,
  orderNumber,
  setOrderStep,
  accounts,
}) => {
  const wallet = useWallet();

  const shdwBucket = useStore((state) => state.shdwBucket);

  const [rate, setRate] = useState(0);
  const [reviewText, setReviewText] = useState("");

  const reviewHandler = async () => {
    try {
      const drive = await new ShdwDrive(privateConnection, wallet).init();

      const reviewJSONBlob = new Blob([
        JSON.stringify({
          rate: rate,
          review: reviewText,
        }),
      ]);
      reviewJSONBlob.name = `review_${orderNumber}.json`;

      const uploadReviewFile = await drive.uploadFile(
        new PublicKey(shdwBucket),
        reviewJSONBlob,
      );
      console.log(uploadReviewFile);
    } catch (error) {
      console.log(error);
      return;
    }

    try {
      const txReviewItem = await program.methods
        .reviewItem(rate)
        .accounts({
          user: wallet.publicKey,
          item: accounts.item,
          store: storePubKey,
          sellerAccount: accounts.sellerAccount,
          order: accounts.order,
          userUsdc: getAssociatedTokenAddressSync(USDC_MINT, wallet.publicKey),
          storeUsdc: store_ata,
        })
        .rpc();
      console.log("tx review item: ", txReviewItem);
      setShowModalReview(false);
      setOrderStep(3);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      open={true}
      onCancel={() => setShowModalReview(false)}
      centered
      onOk={reviewHandler}
      okText="Validate transaction on wallet"
      title={`Review ${title}`}
    >
      <div className="modal-review-wrapper">
        <Rate
          value={rate}
          onChange={(value) => setRate(value)}
          className="modal-review-stars"
        />
        <textarea
          placeholder="Write your review here !"
          className="modal-review-textarea"
          value={reviewText}
          onChange={(text) => setReviewText(text.target.value)}
        ></textarea>
      </div>
    </Modal>
  );
};

export default ModalReview;
