import { program } from "../../../utils/solana/program";
import * as anchor from "@project-serum/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { country } from "../../../utils/config/store";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import "./ListItem.css";

const ListItem = ({ setMode }) => {
  const { publicKey } = useWallet();

  const listItemHandler = async (e) => {
    e.preventDefault();
    // const [item] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [publicKey.toBuffer(), new anchor.BN(country).toBuffer("le", 2)],
    //   program.programId,
    // );
    // const txListItem = await program.methods.
    console.log("list new item");
  };

  return (
    <div className="list-wrapper">
      <div className="list-top">
        <IoArrowBackCircleOutline
          className="back-arrow"
          size={"2.3em"}
          onClick={() => setMode("account")}
        />
        <h2 className="list-title">List new item</h2>
      </div>
      <form className="list-form" onSubmit={listItemHandler}>
        <div className="list-form-field">
          <label>Title</label>
          <input className="input-title"></input>
        </div>
        <div className="list-form-field">
          <label>Private key</label>
          <input className="input-private-key" type="password"></input>
        </div>
        <button className="list-btn" type="submit">
          Validate transaction on wallet
        </button>
      </form>
    </div>
  );
};

export default ListItem;
