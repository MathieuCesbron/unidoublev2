import { useState } from "react";
import { curve } from "../../utils/crypto/crypto";
import {
  program,
  storePubKey,
  connection,
  privateConnection,
} from "../../utils/solana/program";
import solanaLogo from "../../images/solana-logo.png";
import * as anchor from "@project-serum/anchor";
import shadowLogo from "../../images/shadow-logo.png";
import plusLogo from "../../images/plus-logo.png";
import { ShdwDrive } from "@shadow-drive/sdk";
import "./CreateSellerAccount.css";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import useStore from "../../store";

const CreateSellerAccount = () => {
  // const { publicKey } = useWallet();
  const wallet = useAnchorWallet();

  const [loading, setLoading] = useState(true);

  const { connection } = useConnection();

  const sellerDiffieKeyPair = curve.genKeyPair();
  const sellerDiffiePubKey = sellerDiffieKeyPair
    .getPublic()
    .encode("hex", false);
  const sellerDiffiePrivKey = sellerDiffieKeyPair.getPrivate().toString("hex");

  const shdw_hash = "7o69nEJC5rkJYoT2eceCqECJA8nv5BzrbeDaRVX7Zsgi";

  const setIsSeller = useStore((state) => state.setIsSeller);

  async function createSellerAccountHandler() {
    try {
      const drive = await new ShdwDrive(privateConnection, wallet).init();
      const newSpace = await drive.createStorageAccount(
        "pleaseworks",
        "1MB",
        "v2",
      );
      console.log(newSpace);
    } catch (error) {
      console.log(error);
    }

    // const [sellerAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [publicKey.toBuffer()],
    //   program.programId,
    // );

    // try {
    //   const txInitSellerAccount = await program.methods
    //     .initSellerAccount(sellerDiffiePubKey, shdw_hash)
    //     .accounts({
    //       user: publicKey,
    //       store: storePubKey,
    //       sellerAccount: sellerAccount,
    //       systemProgram: anchor.web3.SystemProgram.programId,
    //     })
    //     .rpc();
    //   setIsSeller(true);
    //   console.log("tx init seller account: ", txInitSellerAccount);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  return (
    <div className="create-wrapper">
      <div className="create">
        <h1 className="create-title">Become a Unidouble seller</h1>
        <p>
          It costs less than $1 to start listing items, you can delete the
          account when you want.
        </p>
        <p>
          <a
            className="create-link"
            href="https://www.shadow.cloud/"
            target="_blank"
          >
            Shadow Cloud
          </a>
          &nbsp;has been chosen by Unidouble to provide a decentralized storage
          linked to the Solana blockchain. It is used to store images of items
          listed for example.
        </p>
        <p>
          <a
            className="create-link"
            href="https://phantom.app/blog/swapping-tokens"
            target="_blank"
          >
            You can use the Phantom wallet to swap SOL for some SHDW tokens.
          </a>
        </p>
        <h3>Total cost: </h3>
        <p className="cost">
          <img
            className="token-logo"
            src={solanaLogo}
            alt="solana token logo"
          />
          0.00187 SOL
          <img className="plus-logo" src={plusLogo} alt="plus logo" />
          <img
            className="token-logo"
            src={shadowLogo}
            alt="shadow token logo"
          />
          1 SHDW Token
        </p>
        <button className="btn-create" onClick={createSellerAccountHandler}>
          Create seller account
        </button>
        <p>
          This is your private key, save this somewhere safe, we won't show this
          to you ever again. It will be needed to decode the sales you make.
        </p>
      </div>
    </div>
  );
};

export default CreateSellerAccount;
