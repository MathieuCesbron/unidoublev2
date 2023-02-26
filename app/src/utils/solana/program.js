import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { AnchorProvider, Program, web3 } from "@project-serum/anchor";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import idl from "./idl.json";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const network = process.env.REACT_APP_NETWORK || WalletAdapterNetwork.Devnet;

const endpoint = clusterApiUrl(network);
const privateEndpoint =
  "https://twilight-wider-gadget.solana-mainnet.discover.quiknode.pro/6c0aa0054a47c3fae0262d0de14d04cbe33827b2/";

const connection =
  network == WalletAdapterNetwork.Mainnet
    ? new Connection(privateEndpoint, "confirmed")
    : new Connection(endpoint, "confirmed");
const privateConnection = new Connection(privateEndpoint, "max");

const programID = new PublicKey(idl.metadata.address);

const provider = new AnchorProvider(connection, window.solana, "confirmed");

const program = new Program(idl, programID, provider);

const storePubKey =
  network === WalletAdapterNetwork.Devnet
    ? "8EKsxx59euVgAikiWAtUWUM8kKdphFLtUiHyB7oxX6ZD"
    : "8EKsxx59euVgAikiWAtUWUM8kKdphFLtUiHyB7oxX6ZD";

const USDC_MINT = new web3.PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
);

const creatorPubKey = "4zGnN2e9jFQofWWs2daNqmdnv8GRG8YPbBWQtVCjKJ3G";
const creator_ata = getAssociatedTokenAddressSync(
  USDC_MINT,
  new PublicKey(creatorPubKey),
);

// Bucket owned by public key: 7NowSCVNu6gmQihr1A7MUSves7a5CZY5boGYZQ2vawKT.
// There is no way to create a bucket on devnet, it is a mainnet bucket used for testing on devnet.
const shdwBucketDevnet = "AdSA1249vEWYX7pW9ybP7eb6WeDZvvxRDqbgJz9AdGcf";

// Bucket owned by public key: 4zGnN2e9jFQofWWs2daNqmdnv8GRG8YPbBWQtVCjKJ3G.
// There is no way to create a bucket on devnet, it is a mainnet bucket used for testing on devnet.
const shdwBucketBuyerDevnet = "8fjitq47635kPGYUGJbFkJqqPqrgjkyeZ7M5TwJEJZkr";

export {
  network,
  connection,
  privateConnection,
  programID,
  program,
  storePubKey,
  creatorPubKey,
  creator_ata,
  shdwBucketDevnet,
  shdwBucketBuyerDevnet,
  USDC_MINT,
};
