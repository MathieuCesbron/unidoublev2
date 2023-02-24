import * as anchor from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import creatorSecretKey from "./creator.json";
import storeSecretyKey from "../target/deploy/unidouble-keypair.json";

const provider = anchor.AnchorProvider.env();

anchor.setProvider(provider);
const program = anchor.workspace.Unidouble;

const country = 0;
const creator = provider.publicKey;

const [store, bump] = anchor.web3.PublicKey.findProgramAddressSync(
  [creator.toBuffer(), new anchor.BN(country).toBuffer("le", 2)],
  program.programId
);

console.log("store public key: ", store.toString());

const deployDevnet = async () => {
  // init store
  try {
    const txInitStore = await program.methods
      .initStore(country, bump)
      .accounts({
        user: creator,
        store: store,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();
    console.log("tx init store", txInitStore);
    await provider.connection.confirmTransaction(txInitStore, "confirmed");

    // create the creator and store usdc account
    const storeKeypair = Keypair.fromSecretKey(
      Uint8Array.from(storeSecretyKey)
    );
    const creatorKeypair = Keypair.fromSecretKey(
      Uint8Array.from(creatorSecretKey)
    );

    // change to 4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU on devnet.
    const USDC_MINT = new PublicKey(
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
    );

    const creator_ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      creatorKeypair,
      USDC_MINT,
      creatorKeypair.publicKey
    );
    console.log("creator usdc address: ", creator_ata.address.toString());

    const store_ata = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      creatorKeypair,
      USDC_MINT,
      storeKeypair.publicKey,
      true
    );
    console.log("store usdc address: ", store_ata.address.toString());
  } catch (error) {
    console.log(error);
  }
};

deployDevnet();
