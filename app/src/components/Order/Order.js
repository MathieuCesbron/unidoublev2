import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { Button } from "antd";
import {
  creator_ata,
  program,
  storePubKey,
  USDC_MINT,
} from "../../utils/solana/program";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import "./Order.css";

const Order = ({ orderData }) => {
  const { publicKey } = useWallet();

  console.log(orderData);

  const cancelOrderHandler = async () => {
    const buyer_ata = getAssociatedTokenAddressSync(USDC_MINT, publicKey);
    const store_ata = getAssociatedTokenAddressSync(
      USDC_MINT,
      new PublicKey(storePubKey),
      true,
    );

    try {
      const txCancelOrder = await program.methods
        .cancelOrder()
        .accounts({
          user: publicKey,
          sellerAccount: new PublicKey(
            "BygPVRaQVCMArUCSa4WbY3QQqZ8wHtGp4nUpt7LTRSEW",
          ),
          item: orderData.item_account_public_key,
          store: storePubKey,
          userUsdc: buyer_ata,
          storeUsdc: store_ata,
          creatorUsdc: creator_ata,
          order: orderData.pubkey,
        })
        .rpc();
      console.log("tx cancel order: ", txCancelOrder);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="order-wrapper">
      <Button danger onClick={cancelOrderHandler}>
        Cancel
      </Button>
    </div>
  );
};

export default Order;
