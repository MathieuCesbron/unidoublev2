import { useEffect, useState } from "react";
import {
  connection,
  privateConnection,
  program,
  storePubKey,
} from "../../../utils/solana/program";
import * as anchor from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import {
  getDecodedSellerAccount,
  getSellerAccount,
} from "../../../utils/solana/account";
import { ShdwDrive } from "@shadow-drive/sdk";
import { PublicKey } from "@solana/web3.js";
import ImagesUploader from "./ImagesUploader";
import USDCLogo from "../../../images/usdc-logo.png";
import SelectCategory from "./SelectCategory";
import { Button } from "antd";
import "../Option.css";
import "./ListItem.css";

const ListItem = (props) => {
  const wallet = useWallet();
  const { publicKey } = useWallet();

  const [fileList, setFileList] = useState([]);
  const [fileListBlob, setFileListBlob] = useState([]);
  const [shdwHash, setShdwHash] = useState("");
  const [sellerAccount, setSellerAccount] = useState();
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");

  const [itemFormData, setItemFormData] = useState({
    title: "",
    description: "",
    privateKey: "",
    price: "",
    amount: "",
  });

  useEffect(() => {
    (async () => {
      const sa = await getSellerAccount(publicKey);
      if (!sa) {
        return;
      }
      setSellerAccount(sa);

      const dsa = getDecodedSellerAccount(sa);
      setShdwHash(dsa.shdw_hash);

      setLoading(false);
    })();
  }, [publicKey]);

  const listItemHandler = async (e) => {
    e.preventDefault();

    // Case 1: Wallet is on devnet
    // We upload the shadow files to a shared shadow storage.
    //
    // Case 2: Wallet is on mainnet-beta
    // We upload the shadow files to the shadow storage of the seller.
    const max_u32 = 4_294_967_295;
    const unique_number = Math.floor(Math.random() * max_u32);

    const itemJSONBlob = new Blob(
      [
        JSON.stringify({
          title: itemFormData.title,
          description: itemFormData.description,
          images: fileListBlob.map((file) => file.name),
        }),
      ],
      {
        type: "application/json",
      },
    );
    itemJSONBlob.name = `${unique_number}.json`;

    try {
      const drive = await new ShdwDrive(privateConnection, wallet).init();

      const uploadMultipleFiles = await drive.uploadMultipleFiles(
        new PublicKey(shdwHash),
        [...fileListBlob, itemJSONBlob],
      );
      console.log(uploadMultipleFiles);
    } catch (error) {
      console.log(error);
    }

    const [item] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        publicKey.toBuffer(),
        new anchor.BN(unique_number).toArrayLike(Buffer, "le", 4),
      ],
      program.programId,
    );

    try {
      const txListItem = await program.methods
        .listItem(
          unique_number,
          category,
          itemFormData.price * 100,
          itemFormData.amount,
        )
        .accounts({
          user: publicKey,
          store: storePubKey,
          sellerAccount: sellerAccount?.pubkey,
          item: item,
        })
        .rpc();
      console.log("tx list item: ", txListItem);
      await connection.confirmTransaction(txListItem);
      props.setMode("myItems");
    } catch (error) {
      console.log(error);
    }
  };

  const setItemFormDataHandler = (event) => {
    setItemFormData((prevItemFormData) => ({
      ...prevItemFormData,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="option-wrapper">
      <div className="option-top">
        <IoArrowBackCircleOutline
          className="option-back-arrow"
          size={"2.3em"}
          onClick={() => props.setMode("account")}
        />
        <h2 className="option-title">List new item</h2>
      </div>
      <form className="list-form" name="list" onSubmit={listItemHandler}>
        <div className="list-form-field">
          <label className="list-form-label">Title</label>
          <input
            className="list-input list-input-title"
            name="title"
            value={itemFormData.title}
            onChange={setItemFormDataHandler}
            minLength="10"
            maxLength="75"
          ></input>
        </div>
        <hr className="list-separator" />
        <div className="list-form-field">
          <label className="list-form-label">Description</label>
          <textarea
            className="list-input list-textarea-description"
            name="description"
            value={itemFormData.description}
            onChange={setItemFormDataHandler}
            minLength={10}
            maxLength={10000}
          ></textarea>
        </div>
        <hr className="list-separator" />
        <div className="list-form-field">
          <label className="list-form-label">Category</label>
          <SelectCategory category={category} setCategory={setCategory} />
        </div>
        <hr className="list-separator" />
        <label className="list-form-label-image">
          You can upload up to 10 images
        </label>
        <div className="list-image-uploader">
          <ImagesUploader
            fileList={fileList}
            setFileList={setFileList}
            setFileListBlob={setFileListBlob}
          />
        </div>
        <hr className="list-separator" />
        <div className="list-form-price-amount">
          <div className="list-form-price">
            <div className="list-form-label list-form-label-price">
              <label>Price</label>
              <img
                className="list-usdc-logo"
                src={USDCLogo}
                alt="usdc token logo"
              />
            </div>
            <input
              className="list-input-price"
              type="number"
              name="price"
              value={itemFormData.price}
              onChange={setItemFormDataHandler}
              min="1"
              max="1000000"
              step={0.01}
            ></input>
          </div>
          <div className="list-form-amount">
            <label className="list-form-label list-form-label-amount">
              Amount
            </label>
            <input
              className="list-input-amount"
              type="number"
              name="amount"
              value={itemFormData.amount}
              onChange={setItemFormDataHandler}
              min="1"
              max="50000"
              step="1"
            ></input>
          </div>
        </div>
        <hr className="list-separator" />
        <div className="list-form-field">
          <label className="list-form-label">Private key</label>
          <input
            className="list-input list-input-private-key"
            type="password"
            name="privateKey"
            value={itemFormData.privateKey}
            onChange={setItemFormDataHandler}
            minLength="62"
            maxLength="63"
          ></input>
        </div>
        <Button
          disabled={loading}
          type="primary"
          htmlType="submit"
          size="large"
          style={{ margin: "2em auto" }}
        >
          Validate transaction on wallet
        </Button>
      </form>
    </div>
  );
};

export default ListItem;
