import React, { useEffect, useState } from "react";
import {
  privateConnection,
  program,
  storePubKey,
} from "../../../utils/solana/program";
import * as anchor from "@project-serum/anchor";
import { AnchorWallet, useWallet } from "@solana/wallet-adapter-react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import "./ListItem.css";
import {
  getDecodedSellerAccount,
  getSellerAccount,
} from "../../../utils/solana/sellerAccount";
import { ShadowFile, ShdwDrive } from "@shadow-drive/sdk";
import { PublicKey } from "@solana/web3.js";
import { upload } from "@testing-library/user-event/dist/upload";

interface Props {
  setMode: (s: string) => void;
}

type account = {
  pubkey: PublicKey;
};

const ListItem = (props: Props) => {
  const wallet = useWallet();
  const { publicKey } = useWallet();

  const [fileList, setFileList] = useState<any>();
  const [shdwHash, setShdwHash] = useState("");
  const [sellerAccount, setSellerAccount] = useState<account>();
  const [itemNumber, setItemNumber] = useState(-1);
  const [loading, setLoading] = useState(true);

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

  const listItemHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    // Upload data on shadow drive if we are on mainnet.

    const files: ShadowFile[] = [
      { name: "test.json", file: Buffer.from(JSON.stringify({ ama: "test" })) },
    ];

    try {
      const drive = await new ShdwDrive(
        privateConnection,
        wallet as AnchorWallet,
      ).init();

      const uploadMultipleFiles = await drive.uploadMultipleFiles(
        new PublicKey(shdwHash),
        fileList as FileList,
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
      <input
        type={"file"}
        onChange={(e) => {
          setFileList(e.target.files);
        }}
      ></input>
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
          <label>Title</label>
          <input className="input-title"></input>
        </div>
        <div className="list-form-field">
          <label>Description</label>
          <input className="input-description"></input>
        </div>
        <div className="list-form-field">
          <label>Private key</label>
          <input className="input-private-key" type="password"></input>
        </div>

        <button disabled={loading} className="list-btn" type="submit">
          Validate transaction on wallet
        </button>
      </form>
    </div>
  );
};

export default ListItem;
