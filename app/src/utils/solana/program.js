import { AnchorProvider, Program } from "@project-serum/anchor";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import idl from "./idl.json";

const network = clusterApiUrl("devnet");
const privateNetwork =
  "https://twilight-wider-gadget.solana-mainnet.discover.quiknode.pro/6c0aa0054a47c3fae0262d0de14d04cbe33827b2/";

const connection = new Connection(network, "confirmed");
const privateConnection = new Connection(privateNetwork, "max");

const programID = new PublicKey(idl.metadata.address);

const provider = new AnchorProvider(connection, window.solana, "confirmed");

const program = new Program(idl, programID, provider);

const storePubKey = "4ZxU8ybfhsSDrziuBkCuoTqUT7jHgFQHhcDgT2iD9DEx";
const creatorPubKey = "4zGnN2e9jFQofWWs2daNqmdnv8GRG8YPbBWQtVCjKJ3G";

export {
  connection,
  privateConnection,
  programID,
  program,
  storePubKey,
  creatorPubKey,
};
