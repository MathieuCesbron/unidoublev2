import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
  Button,
  Image,
  Rate,
  Modal,
  InputNumber,
  Input,
  Form,
  Tooltip,
} from "antd";
import * as anchor from "@project-serum/anchor";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import USDCLogo from "../../images/usdc-logo.png";
import {
  getDecodedSellerAccount,
  getSellerAccount,
} from "../../utils/solana/account";
import { curve } from "../../utils/crypto/crypto";
import { AES, mode, enc } from "crypto-js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  programID,
  program,
  creatorPubKey,
  storePubKey,
  USDC_MINT,
  connection,
  network,
  privateConnection,
  store_ata,
} from "../../utils/solana/program";
import { PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ShdwDrive } from "@shadow-drive/sdk";
import useStore from "../../store";
import Reviews from "./Reviews";
import "../SellerAccount/Option.css";
import "./ItemResult.css";

const ItemResult = () => {
  const wallet = useWallet();
  const { publicKey } = useWallet();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [showModalBuy, setShowModalBuy] = useState(false);

  const shdwBucket = useStore((state) => state.shdwBucket);
  const isBuyer = useStore((state) => state.isBuyer);

  const [sellerDiffiePublicKey, setSellerDiffiePublicKey] = useState("");

  const [buyerDiffieKeyPair] = useState(curve.genKeyPair());
  const [buyerDiffiePubKey] = useState(
    buyerDiffieKeyPair.getPublic().encode("hex"),
  );

  const [amountToBuy, setAmountToBuy] = useState(1);
  const [addressData, setAddressData] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [encryptedAddress, setEncrypedAddress] = useState();
  const [salt, setSalt] = useState("");
  const [iv, setIv] = useState("");

  useEffect(() => {
    (async () => {
      // TODO: if state is undefined, we should get the data on chain since we have the unique_number on the url.

      // get the diffie public key of the seller
      const sa = await getSellerAccount(state.seller_public_key);
      const dsa = getDecodedSellerAccount(sa);
      setSellerDiffiePublicKey(dsa.diffie_public_key);
    })();
  }, []);

  const updateAddressData = (e) => {
    setAddressData((prevAddressData) => ({
      ...prevAddressData,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const sellerDiffieBasepoint = curve
      .keyFromPublic(Buffer.from(sellerDiffiePublicKey, "hex"))
      .getPublic();

    const sharedSecret = buyerDiffieKeyPair
      .derive(sellerDiffieBasepoint)
      .toString("hex");

    const cipher = AES.encrypt(JSON.stringify(addressData), sharedSecret, {
      mode: mode.CTR,
    });

    const cipherText = cipher.ciphertext.toString();
    setSalt(cipher.salt.toString());
    setIv(cipher.iv.toString());
    setEncrypedAddress(cipherText);

    // It works to decrypt this way:
    // const text = AES.decrypt(
    //   {
    //     ciphertext: enc.Hex.parse(cipherText),
    //     iv: enc.Hex.parse(cipher.iv.toString()),
    //     salt: enc.Hex.parse(cipher.salt.toString()),
    //   },
    //   sharedSecret,
    //   { mode: mode.CTR },
    // );
    // console.log("decyrpt:", text.toString(enc.Utf8));
  }, [addressData]);

  const buyItemHandler = async () => {
    const order_number = Math.floor(Math.random() * 1000000);
    const [order] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        publicKey.toBuffer(),
        new anchor.BN(order_number).toArrayLike(Buffer, "le", 4),
      ],
      programID,
    );

    try {
      const drive = await new ShdwDrive(privateConnection, wallet).init();

      const orderJSONBlob = new Blob([
        JSON.stringify({
          number: order_number,
          address: encryptedAddress,
          buyer_diffie_public_key: buyerDiffiePubKey,
          salt: salt,
          iv: iv,
          item_pubkey: state.itemData.pubkey,
          order_pubkey: order.toString(),
        }),
      ]);
      orderJSONBlob.name = `order_${order_number}.json`;

      const uploadOrderFile = await drive.uploadFile(
        new PublicKey(shdwBucket),
        orderJSONBlob,
      );
      console.log(uploadOrderFile);
    } catch (error) {
      console.log(error);
    }
    // We can only use USDC on mainnet.
    if (network !== WalletAdapterNetwork.Mainnet) {
      return;
    }

    try {
      const buyer_ata = getAssociatedTokenAddressSync(USDC_MINT, publicKey);

      const txBuyItem = await program.methods
        .buyItem(order_number, amountToBuy, shdwBucket)
        .accounts({
          user: publicKey,
          sellerAccount: state.itemData.seller_account_public_key,
          seller: state.itemData.seller_public_key,
          item: state.itemData.pubkey,
          storeCreator: creatorPubKey,
          store: storePubKey,
          userUsdc: buyer_ata,
          storeUsdc: store_ata,
          tokenProgram: TOKEN_PROGRAM_ID,
          order: order,
        })
        .rpc();
      await connection.confirmTransaction(txBuyItem, "max");
      console.log("tx buy item: ", txBuyItem);
      navigate("/orders");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="option-wrapper">
      <div className="option-top">
        <IoArrowBackCircleOutline
          className="option-back-arrow"
          size={"5em"}
          onClick={() => navigate(-1)}
        />
        <h4 className="option-title">{state.itemInfo.title}</h4>
      </div>
      <div className="item-result-wrapper">
        <Image
          preview={{ visible: false }}
          width={"50%"}
          style={{ border: "black solid 1px", borderRadius: "2px" }}
          src={`https://shdw-drive.genesysgo.net/${state.itemData.shdw_hash_seller}/${state.itemInfo.images[0]}`}
          onClick={() => setVisible(true)}
        />
        <div style={{ display: "none" }}>
          <Image.PreviewGroup
            preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
          >
            {state.itemInfo.images.map((image) => (
              <Image
                key={image}
                src={`https://shdw-drive.genesysgo.net/${state.itemData.shdw_hash_seller}/${image}`}
              />
            ))}
          </Image.PreviewGroup>
        </div>
        <div className="item-result-body">
          <div className="item-result-field">
            <img className="item-usdc-logo" src={USDCLogo} alt="usdc-logo" />
            <p className="item-usdc">{state.itemData.price / 100}</p>
          </div>
          <Tooltip
            color={"grey"}
            title={Math.round(state.itemData.rating * 100) / 100}
          >
            <div>
              <Rate
                disabled
                allowHalf
                defaultValue={state.itemData.rating}
                style={{ fontSize: 28, margin: "0", maxWidth: "100%" }}
              />
            </div>
          </Tooltip>
          <div className="item-result-stats">
            <p className="item-result-amount">
              {state.itemData.amount} available
            </p>
            {state.itemData.buyer_count ? (
              <p className="item-result-buyers">
                {state.itemData.buyer_count}
                {state.itemData.buyer_count === 1 ? " person" : " persons"}{" "}
                bought this item
              </p>
            ) : (
              <p className="item-result-buyers">Nobody bought this item yet</p>
            )}
          </div>
          <Button
            type="primary"
            disabled={!isBuyer}
            size="large"
            onClick={() => setShowModalBuy(true)}
          >
            Buy item
          </Button>
        </div>
      </div>
      <p className="item-result-description">{state.itemInfo.description}</p>
      <Reviews itemNumber={state.itemData.unique_number} />
      <Modal
        title={`Buy ${state.itemInfo.title}`}
        centered
        open={showModalBuy}
        onCancel={() => setShowModalBuy(false)}
        onOk={buyItemHandler}
        okText="Validate transaction on wallet"
      >
        <p>
          Your delivery address is encrypted on the blockchain, only the seller
          can decrypt it. You can review the article bought and get 1% cashback.
        </p>
        <hr className="item-result-hr" />
        <Form>
          <p className="item-result-modal-price">
            Price: {state.itemData.price / 100} USDC
          </p>
          <div className="item-result-input-amount">
            <label className="item-result-amount-label">Amount to buy: </label>
            <InputNumber
              type="number"
              placeholder="1"
              min={1}
              max={state.itemData.amount}
              onChange={(value) => setAmountToBuy(value)}
            ></InputNumber>
          </div>
          <hr className="item-result-hr" />
          <label className="item-result-label">Address</label>
          <Input name="address" onChange={updateAddressData}></Input>
          <label className="item-result-label">City</label>
          <Input name="city" onChange={updateAddressData}></Input>
          <label className="item-result-label">State</label>
          <Input name="state" onChange={updateAddressData}></Input>
          <label className="item-result-label">Zip</label>
          <Input name="zip" onChange={updateAddressData}></Input>
        </Form>
        <hr className="item-result-hr" />
        <label>Encrypted delivery address</label>
        <Input disabled value={encryptedAddress}></Input>
        <hr className="item-result-hr" />
        <p>Price to pay: {(state.itemData.price / 100) * amountToBuy} USDC</p>
      </Modal>
    </div>
  );
};

export default ItemResult;
