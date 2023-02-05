import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Unidouble } from "../target/types/unidouble";

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
  console.log(
    country,
    bump,
    creator,
    store,
    anchor.web3.SystemProgram.programId.toString()
  );
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
  } catch (error) {
    console.log("error: " + error);
  }
};

deployDevnet();
