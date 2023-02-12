import React, { useEffect, useState } from "react";
import {
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
} from "../../../utils/solana/sellerAccount";
import { ShdwDrive } from "@shadow-drive/sdk";
import { PublicKey } from "@solana/web3.js";
import ImagesUploader from "./ImagesUploader";
import USDCLogo from "../../../images/usdc-logo.png";
import SelectCategory from "./SelectCategory";
import "./ListItem.css";

const ListItem = (props) => {
  const wallet = useWallet();
  const { publicKey } = useWallet();

  const [fileList, setFileList] = useState([]);
  const [fileListBlob, setFileListBlob] = useState([]);
  const [shdwHash, setShdwHash] = useState("");
  const [sellerAccount, setSellerAccount] = useState();
  const [itemNumber, setItemNumber] = useState(-1);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("");

  const [itemFormData, setItemFormData] = useState({
    category: "",
    privateKey: "",
    price: "",
    amount: "",
  });

  useEffect(() => {
    (async () => {
      const sa = await getSellerAccount(publicKey);
      setSellerAccount(sa);

      const dsa = getDecodedSellerAccount(sa);
      setShdwHash(dsa.shdw_hash);
      setItemNumber(dsa.item_count);

      setLoading(false);
    })();
  }, [publicKey]);

  const listItemHandler = async (e) => {
    e.preventDefault();

    // Upload data on shadow drive if we are on mainnet.

    const files = [
      { name: "test.json", file: Buffer.from(JSON.stringify({ ama: "test" })) },
    ];

    try {
      const drive = await new ShdwDrive(privateConnection, wallet).init();

      const uploadMultipleFiles = await drive.uploadMultipleFiles(
        new PublicKey(shdwHash),
        fileListBlob,
      );
      console.log(uploadMultipleFiles);
    } catch (error) {
      console.log(error);
    }

    // const [item] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [
    //     publicKey!.toBuffer(),
    //     new anchor.BN(itemNumber).toArrayLike(Buffer, "le", 2),
    //   ],
    //   program.programId,
    // );

    // try {
    //   const txListItem = await program.methods
    //     .listItem(
    //       itemFormData.category,
    //       itemFormData.price,
    //       itemFormData.amount,
    //     )
    //     .accounts({
    //       user: publicKey!,
    //       store: storePubKey,
    //       sellerAccount: sellerAccount?.pubkey,
    //       item: item,
    //     })
    //     .rpc();
    //   console.log("tx list item: ", txListItem);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div className="list-wrapper">
      <div className="list-top">
        <IoArrowBackCircleOutline
          className="back-arrow"
          size={"2.3em"}
          onClick={() => props.setMode("account")}
        />
        <h2 className="list-title">List new item</h2>
      </div>
      <form className="list-form" onSubmit={listItemHandler}>
        <div className="list-form-field">
          <label className="list-form-label">Title</label>
          <input className="list-input list-input-title"></input>
        </div>
        <hr className="list-separator" />
        <div className="list-form-field">
          <label className="list-form-label">Description</label>
          <textarea className="list-input list-textarea-description"></textarea>
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
            itemNumber={itemNumber}
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
            <input className="list-input-price" type="number"></input>
          </div>
          <div className="list-form-amount">
            <label className="list-form-label list-form-label-amount">
              Amount
            </label>
            <input className="list-input-amount" type="number"></input>
          </div>
        </div>
        <hr className="list-separator" />
        <div className="list-form-field">
          <label className="list-form-label">Private key</label>
          <input
            className="list-input list-input-private-key"
            type="password"
          ></input>
        </div>
        <button disabled={loading} className="list-btn" type="submit">
          Validate transaction on wallet
        </button>
      </form>
    </div>
  );
};

export default ListItem;
