import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import USDCLogo from "../../images/usdc-logo.png";
import { Button, Image } from "antd";
import {
  creator_ata,
  program,
  storePubKey,
  USDC_MINT,
} from "../../utils/solana/program";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useEffect, useState } from "react";
import "./Order.css";

const Order = ({ orderData, setDecodedOrders }) => {
  const { publicKey } = useWallet();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [itemInfo, setItemInfo] = useState({});

  const orderState = (() => {
    if (!orderData.is_approved) {
      return "Waiting for seller approval";
    } else if (!orderData.is_shipped) {
      return "waiting for shipping";
    } else if (!orderData.is_reviewed) {
      return "waiting for reviweing";
    } else {
      return "done";
    }
  })();

  const orderDescription = (() => {
    if (!orderData.is_approved) {
      return "you can cancel the order as long as the seller did not approved it. A 1% fee is taken.";
    } else if (!orderData.is_shipped) {
      return 1;
    } else if (!orderData.is_reviewed) {
      return 2;
    } else {
      return 3;
    }
  })();

  // const [shadowHashSeller, setShadowHashSeller] = useState([]);

  useEffect(() => {
    (async () => {
      fetch(
        `https://shdw-drive.genesysgo.net/${orderData.shdw_hash_seller}/${orderData.item_number}.json`,
      )
        .then((res) => res.json())
        .then((resData) => {
          setItemInfo(resData);
          setLoading(false);
        });
    })();
  }, []);

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
          sellerAccount: orderData.seller_account_public_key,
          item: orderData.item_account_public_key,
          store: storePubKey,
          userUsdc: buyer_ata,
          storeUsdc: store_ata,
          creatorUsdc: creator_ata,
          order: orderData.pubkey,
        })
        .rpc();
      console.log("tx cancel order: ", txCancelOrder);
      setDecodedOrders((prevDecodedOrders) =>
        prevDecodedOrders.filter(
          (prevDecodedOrder) =>
            prevDecodedOrder.order_number !== orderData.order_number,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="order-wrapper">
      {!loading && (
        <>
          <Image
            preview={{ visible: false }}
            style={{
              objectFit: "cover",
              width: "250px",
              height: "250px",
            }}
            className="item-image"
            src={`https://shdw-drive.genesysgo.net/${orderData.shdw_hash_seller}/${itemInfo.images[0]}`}
            onClick={() => setVisible(true)}
          />
          <div style={{ display: "none" }}>
            <Image.PreviewGroup
              preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
            >
              {itemInfo.images.map((image) => (
                <Image
                  key={image}
                  src={`https://shdw-drive.genesysgo.net/${orderData.shdw_hash_seller}/${image}`}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        </>
      )}
      <div className="order-body">
        <div className="order-top">
          <h3 className="order-title">{itemInfo.title}</h3>
          <Button danger size="large" onClick={cancelOrderHandler}>
            CANCEL
          </Button>
        </div>
        <div className="order-mid">
          <div className="order-price">
            <img className="order-usdc-logo" src={USDCLogo} alt="usdc-logo" />
            <p className="order-usdc">{orderData.price_bought / 100}</p>
          </div>
          <p>{orderData.amount_bought} unit bought</p>
        </div>
        <div className="order-bottom">
          <p className="order-state">{orderState}</p>
          <p className="order-description">{orderDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default Order;
