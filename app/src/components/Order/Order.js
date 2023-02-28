import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import USDCLogo from "../../images/usdc-logo.png";
import { Button, Image, Modal, Rate, Steps, Tag } from "antd";
import {
  creator_ata,
  privateConnection,
  program,
  storePubKey,
  store_ata,
  USDC_MINT,
} from "../../utils/solana/program";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { useEffect, useState } from "react";
import { AES, enc, mode as modeCrypto } from "crypto-js";
import { curve } from "../../utils/crypto/crypto";
import { ShdwDrive } from "@shadow-drive/sdk";
import ModalReview from "../BuyerAccount/ModalReview";
import "./Order.css";

const Order = ({ orderData, setDecodedOrders, mode }) => {
  const wallet = useWallet();
  const { publicKey } = useWallet();

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [itemInfo, setItemInfo] = useState({});
  const [showModalAddress, setShowModalAddress] = useState(false);

  const [showModalReview, setShowModalReview] = useState(false);
  const [reviewRate, setReviewRate] = useState(0);

  const orderStepInit = () => {
    if (!orderData.is_approved) {
      return 0;
    } else if (!orderData.is_shipped) {
      return 1;
    } else if (!orderData.is_reviewed) {
      return 2;
    } else {
      return 3;
    }
  };
  const [orderStep, setOrderStep] = useState(orderStepInit());

  const orderDescription = (() => {
    if (orderStep === 0) {
      if (mode === "sales")
        return "You can approve the order. You will get the money at the next step when the order will be marked as shipped.";
      return "You can cancel as long as the seller did not approved it. A 1% fee is taken.";
    }

    if (orderStep === 1) {
      if (mode === "sales")
        return "Ship the item to the delivery address then mark it as shipped. You will get payed at this step.";
      return "The order is approved ! The seller will ship the item soon.";
    }

    if (orderStep === 2) {
      if (mode === "sales")
        return "You shipped the item. The buyer still has to review it. Congratulations on your sales !";
      return "The item is shipped ! Don't forget to come back here for the review and get the 1% cashback.";
    }

    if (orderStep == 3) {
      if (mode === "sales")
        return "The order is completed, the buyer reviewed the item.";
      return "The order is completed, you reviewed the item and got the 1% cashback.";
    }
  })();

  useEffect(() => {
    fetch(
      `https://shdw-drive.genesysgo.net/${orderData.shdw_hash_seller}/${orderData.item_number}.json`,
    )
      .then((res) => res.json())
      .then((resData) => {
        setItemInfo(resData);
        setLoading(false);
      });

    fetch(
      `https://shdw-drive.genesysgo.net/${orderData.shdw_hash_buyer}/order_${orderData.order_number}.json`,
    )
      .then((res) => res.json())
      .then((resData) => {
        console.log(resData.buyer_diffie_public_key);
        // const basepoint = curve.keyFromPublic(Buffer.from(props.buyerDiffiePublicKeys[i], "hex")).getPublic()
        // const basepoint = curve.keyFromPublic(
        //   Buffer.from(orderData.buyer_diffie_public_key),
        // );
        // // TODO: get the buyer diffie public key from shadow drive then I can get the shared secret.
        // const sharedSecret = "";
        // const text = AES.decrypt(
        //   {
        //     ciphertext: enc.Hex.parse(resData.address),
        //     iv: enc.Hex.parse(resData.iv),
        //     salt: enc.Hex.parse(resData.salt),
        //   },
        //   sharedSecret,
        //   { mode: modeCrypto.CTR },
        // );
        // console.log("decrypt: ", text.toString(enc.Utf8));
      });
  }, []);

  const approveOrderHandler = async () => {
    // console.log(itemInfo);
    try {
      const txApproveOrder = await program.methods
        .approveOrder()
        .accounts({
          user: publicKey,
          item: orderData.item_account_public_key,
          order: orderData.pubkey,
        })
        .rpc();
      console.log("tx approve order: ", txApproveOrder);
      setOrderStep(1);
    } catch (error) {
      console.log(error);
    }
  };

  const shippedOrderHandler = async () => {
    const seller_ata = getAssociatedTokenAddressSync(
      USDC_MINT,
      new PublicKey(orderData.seller_public_key),
    );

    try {
      const txShippedOrder = await program.methods
        .shippedOrder()
        .accounts({
          user: publicKey,
          sellerAccount: orderData.seller_account_public_key,
          store: storePubKey,
          item: orderData.item_account_public_key,
          sellerUsdc: seller_ata,
          creatorUsdc: creator_ata,
          storeUsdc: store_ata,
          order: orderData.pubkey,
        })
        .rpc();
      console.log("tx shipped order: ", txShippedOrder);
      setOrderStep(2);
    } catch (error) {
      console.log(error);
    }
  };

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

  const ButtonSales = () => {
    switch (orderStep) {
      case 0:
        return (
          <Button type="primary" size="large" onClick={approveOrderHandler}>
            APPROVE
          </Button>
        );
      case 1:
        return (
          <Button type="primary" size="large" onClick={shippedOrderHandler}>
            MARK AS SHIPPED
          </Button>
        );
      case 2:
        return (
          <Tag
            color={"blue"}
            style={{ margin: 0, fontSize: "1rem", padding: "0.3em 0.6em" }}
            size="large"
          >
            Done
          </Tag>
        );
    }
  };

  const TopRightSpace = () => {
    if (mode === "sales") {
      return <ButtonSales />;
    }

    if (orderStep === 2) {
      return (
        <>
          <Button
            type="primary"
            size="large"
            onClick={() => setShowModalReview(true)}
          >
            REVIEW
          </Button>
          {showModalReview && (
            <ModalReview
              setShowModalReview={setShowModalReview}
              title={itemInfo.title}
              orderNumber={orderData.order_number}
              setOrderStep={setOrderStep}
              accounts={{
                item: orderData.item_account_public_key,
                sellerAccount: orderData.seller_account_public_key,
                order: orderData.pubkey,
              }}
            ></ModalReview>
          )}
        </>
      );
    } else if (orderStep === 3) {
      return (
        <Tag
          color={"blue"}
          style={{ margin: 0, fontSize: "1rem", padding: "0.3em 0.6em" }}
          size="large"
        >
          Done
        </Tag>
      );
    }

    return (
      <Button
        disabled={orderStep !== 0}
        danger
        size="large"
        onClick={cancelOrderHandler}
      >
        CANCEL
      </Button>
    );
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
          <TopRightSpace />
        </div>
        <div className="order-mid">
          <div className="order-price">
            <img className="order-usdc-logo" src={USDCLogo} alt="usdc-logo" />
            <p className="order-usdc">{orderData.price_bought / 100}</p>
          </div>
          <p>
            {orderData.amount_bought} unit{" "}
            {mode === "sales" ? "sold" : "bought"}
          </p>
          {mode === "sales" && orderStep < 1 && (
            <Button
              type="primary"
              className="order-address-btn"
              size="large"
              onClick={() => setShowModalAddress(true)}
            >
              DELIVERY ADDRESS
            </Button>
          )}
          <Modal
            title={itemInfo.title}
            onOk={() => setShowModalAddress(false)}
            closable={false}
            cancelButtonProps={{ style: { display: "none" } }}
            centered
            open={showModalAddress}
          >
            <p>
              Send {orderData.amount_bought}{" "}
              {orderData.amount_bought === 1 ? "item" : "items"} to:
            </p>
          </Modal>
        </div>
        <div className="order-bottom">
          <p className="order-description">{orderDescription}</p>
          <Steps
            size="small"
            responsive={false}
            className="order-step"
            current={orderStep}
            items={[
              {
                title: "Approved",
              },
              {
                title: "Shipped",
              },
              {
                title: "Reviewed",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Order;
