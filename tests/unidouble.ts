import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Unidouble } from "../target/types/unidouble";
import { generateUser } from "../utils";
import {
  getAccount,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
// import * as cryptoJS from "crypto-js";
import { ec } from "elliptic";
import creatorSecretKey from "./keys/creator.json";
import { BN } from "bn.js";

const curve = new ec("curve25519");

const mint = new anchor.web3.PublicKey(
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"
);

describe("unidouble", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.Unidouble as Program<Unidouble>;

  it("works as a store", async () => {
    const creator = anchor.web3.Keypair.fromSecretKey(
      Uint8Array.from(creatorSecretKey)
    );
    console.log(`creator public key: ${creator.publicKey.toString()}`);

    const txAirdropCreator = await provider.connection.requestAirdrop(
      creator.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(txAirdropCreator);

    let creatorUSDC = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      creator,
      mint,
      creator.publicKey
    );
    console.log(
      `creator address USDC account: ${creatorUSDC.address.toString()}`
    );

    const country = 0;

    const [store, bump] = await anchor.web3.PublicKey.findProgramAddress(
      // We use the 2 argument because a u16 is 2x a u8.
      [creator.publicKey.toBuffer(), new anchor.BN(country).toBuffer("le", 2)],
      program.programId
    );
    console.log(`store address: ${store.toString()}`);

    // Init store.
    try {
      const txInitStore = await program.methods
        .initStore(country, bump)
        .accounts({
          user: creator.publicKey,
          store: store,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
      await provider.connection.confirmTransaction(txInitStore, "confirmed");
      console.log(`tx init store: ${txInitStore}`);
    } catch (error) {
      console.log(error);
    }

    // seller must remember the private key.
    const seller = await generateUser(2, provider);
    const sellerDiffieKeyPair = curve.genKeyPair();
    // sellerDiffiePubKey has a length of 64.
    const sellerDiffiePubKey = sellerDiffieKeyPair
      .getPublic()
      .encode("hex", true);
    const shdw_hash = "7o69nEJC5rkJYoT2eceCqECJA8nv5BzrbeDaRVX7Zsgi";

    const [sellerAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [seller.publicKey.toBuffer()],
      program.programId
    );
    console.log("seller account address: ", sellerAccount.toString());

    // Create seller account.
    try {
      const txInitSellerAccount = await program.methods
        .initSellerAccount(sellerDiffiePubKey, shdw_hash)
        .accounts({
          user: seller.publicKey,
          store: store,
          sellerAccount: sellerAccount,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([seller])
        .rpc();
      await provider.connection.confirmTransaction(
        txInitSellerAccount,
        "confirmed"
      );
      console.log(`tx init seller account: ${txInitSellerAccount}`);
    } catch (error) {
      console.log(error);
    }

    // List an item.
    const category = 0;
    const price = 250;
    const amount = 2;

    const max_u32 = 4_294_967_295;
    const unique_number = Math.floor(Math.random() * max_u32);

    const [item] = await anchor.web3.PublicKey.findProgramAddress(
      // We use the 4 argument because a u32 is 4x a u8.
      [
        seller.publicKey.toBuffer(),
        new anchor.BN(unique_number).toBuffer("le", 4),
      ],
      program.programId
    );
    console.log("item address: ", item.toString());

    try {
      const txListItem = await program.methods
        .listItem(unique_number, category, price, amount)
        .accounts({
          user: seller.publicKey,
          store: store,
          sellerAccount: sellerAccount,
          item: item,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([seller])
        .rpc();
      await provider.connection.confirmTransaction(txListItem, "confirmed");
      console.log(`tx list item: ${txListItem}`);
    } catch (error) {
      console.log(error);
    }

    const new_category = 1;
    const new_price = 200;
    const new_amount = 3;

    //  Update item
    try {
      const txUpdateItem = await program.methods
        .updateItem(new_category, new_price, new_amount)
        .accounts({
          user: seller.publicKey,
          store: store,
          sellerAccount: sellerAccount,
          item: item,
        })
        .signers([seller])
        .rpc();
      await provider.connection.confirmTransaction(txUpdateItem, "confirmed");
      console.log(`tx update item: ${txUpdateItem}`);
    } catch (error) {
      console.log(error);
    }

    const buyer = await generateUser(2, provider);
    console.log(`buyer public key: ${buyer.publicKey.toString()}`);
    const amountToBuy = 2;
    const buyerShdwHash = "4u4nZ3Dgt5jnVu7wT6NY7MXrRojjT9Mx2u5cGXi2Lz3c";

    let [buyerAccount] = await anchor.web3.PublicKey.findProgramAddress(
      [
        buyer.publicKey.toBuffer(),
        Buffer.from(anchor.utils.bytes.utf8.encode("unidouble_buyer")),
      ],
      program.programId
    );
    console.log(`buyer account address: ${buyerAccount.toString()}`);

    // create buyer account
    try {
      const txInitBuyerAccount = await program.methods
        .initBuyerAccount(shdw_hash)
        .accounts({ user: buyer.publicKey, buyerAccount: buyerAccount })
        .signers([buyer])
        .rpc();
      await provider.connection.confirmTransaction(
        txInitBuyerAccount,
        "confirmed"
      );
      console.log(`tx init buyer account: ${txInitBuyerAccount}`);
    } catch (error) {
      console.log(error);
    }

    // mint fake USDC to buyer token account
    const mintInfo = await getMint(provider.connection, mint);
    console.log(
      `mint authority of USDC mint account is: ${mintInfo.mintAuthority.toString()}`
    );

    let buyerUSDC = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      buyer,
      mint,
      buyer.publicKey
    );
    console.log(`buyer USDC address: ${buyerUSDC.address.toString()}`);

    await mintTo(
      provider.connection,
      creator,
      mint,
      buyerUSDC.address,
      creator.publicKey,
      1000
    );
    buyerUSDC = await getAccount(provider.connection, buyerUSDC.address);
    console.log("buyer USDC balance: ", buyerUSDC.amount);

    // create ata for seller account
    let sellerUSDC = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      seller,
      mint,
      seller.publicKey
    );
    console.log(`seller USDC address: ${sellerUSDC.address.toString()}`);

    // create ata for store account
    let storeUSDC = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      creator,
      mint,
      store,
      true
    );
    console.log(`store USDC address: ${storeUSDC.address.toString()}`);

    let uuid = Math.floor(Math.random() * 1000000);
    let [order] = await anchor.web3.PublicKey.findProgramAddress(
      // We use the 8 argument because a u64 is 8x a u8.
      [buyer.publicKey.toBuffer(), new anchor.BN(uuid).toBuffer("le", 4)],
      program.programId
    );
    console.log(`order address: ${order.toString()}`);

    // buy item
    try {
      const txBuyItem = await program.methods
        .buyItem(uuid, amountToBuy, buyerShdwHash)
        .accounts({
          user: buyer.publicKey,
          sellerAccount: sellerAccount,
          seller: seller.publicKey,
          item: item,
          storeCreator: creator.publicKey,
          store: store,
          userUsdc: buyerUSDC.address,
          storeUsdc: storeUSDC.address,
          tokenProgram: TOKEN_PROGRAM_ID,
          order: order,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([buyer])
        .rpc();
      await provider.connection.confirmTransaction(txBuyItem, "confirmed");
      console.log(`tx buy item ${txBuyItem}`);

      storeUSDC = await getAccount(provider.connection, storeUSDC.address);
      console.log("store usdc balance: ", storeUSDC.amount);

      buyerUSDC = await getAccount(provider.connection, buyerUSDC.address);
      console.log("buyer usdc balance: ", buyerUSDC.amount);

      sellerUSDC = await getAccount(provider.connection, sellerUSDC.address);
      console.log("seller usdc balance: ", sellerUSDC.amount);

      creatorUSDC = await getAccount(provider.connection, creatorUSDC.address);
      console.log("creator usdc balance: ", creatorUSDC.amount);
    } catch (error) {
      console.log(error);
    }

    // cancel order
    try {
      const txCancelOrder = await program.methods
        .cancelOrder()
        .accounts({
          user: buyer.publicKey,
          sellerAccount: sellerAccount,
          item: item,
          store: store,
          userUsdc: buyerUSDC.address,
          creatorUsdc: creatorUSDC.address,
          storeUsdc: storeUSDC.address,
          order: order,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([buyer])
        .rpc();
      await provider.connection.confirmTransaction(txCancelOrder, "confirmed");
      console.log(`tx cancel order ${txCancelOrder}`);

      storeUSDC = await getAccount(provider.connection, storeUSDC.address);
      console.log("store usdc balance: ", storeUSDC.amount);

      buyerUSDC = await getAccount(provider.connection, buyerUSDC.address);
      console.log("buyer usdc balance: ", buyerUSDC.amount);

      sellerUSDC = await getAccount(provider.connection, sellerUSDC.address);
      console.log("seller usdc balance: ", sellerUSDC.amount);

      creatorUSDC = await getAccount(provider.connection, creatorUSDC.address);
      console.log("creator usdc balance: ", creatorUSDC.amount);
    } catch (error) {
      console.log(error);
    }

    uuid = Math.floor(Math.random() * 1000000);
    [order] = await anchor.web3.PublicKey.findProgramAddress(
      // We use the 8 argument because a u64 is 8x a u8.
      [buyer.publicKey.toBuffer(), new anchor.BN(uuid).toBuffer("le", 4)],
      program.programId
    );
    console.log(`order address: ${order.toString()}`);

    // re-buy after cancel order
    try {
      // find order address

      const txBuyItem = await program.methods
        .buyItem(uuid, amountToBuy, buyerShdwHash)
        .accounts({
          user: buyer.publicKey,
          sellerAccount: sellerAccount,
          seller: seller.publicKey,
          item: item,
          storeCreator: creator.publicKey,
          store: store,
          userUsdc: buyerUSDC.address,
          storeUsdc: storeUSDC.address,
          tokenProgram: TOKEN_PROGRAM_ID,
          order: order,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([buyer])
        .rpc();
      await provider.connection.confirmTransaction(txBuyItem, "confirmed");
      console.log(`tx buy item ${txBuyItem}`);

      storeUSDC = await getAccount(provider.connection, storeUSDC.address);
      console.log("store usdc balance: ", storeUSDC.amount);

      buyerUSDC = await getAccount(provider.connection, buyerUSDC.address);
      console.log("buyer usdc balance: ", buyerUSDC.amount);

      sellerUSDC = await getAccount(provider.connection, sellerUSDC.address);
      console.log("seller usdc balance: ", sellerUSDC.amount);

      creatorUSDC = await getAccount(provider.connection, creatorUSDC.address);
      console.log("creator usdc balance: ", creatorUSDC.amount);
    } catch (error) {
      console.log(error);
    }

    // seller approves order
    try {
      const txApproveOrder = await program.methods
        .approveOrder()
        .accounts({
          user: seller.publicKey,
          item: item,
          order: order,
        })
        .signers([seller])
        .rpc();
      await provider.connection.confirmTransaction(txApproveOrder, "confirmed");
      console.log("tx seller approved the order: ", txApproveOrder);
    } catch (error) {
      console.log(error);
    }

    // seller shipped the order
    try {
      const txShippedOrder = await program.methods
        .shippedOrder()
        .accounts({
          user: seller.publicKey,
          sellerAccount: sellerAccount,
          store: store,
          item: item,
          sellerUsdc: sellerUSDC.address,
          creatorUsdc: creatorUSDC.address,
          storeUsdc: storeUSDC.address,
          order: order,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([seller])
        .rpc();
      await provider.connection.confirmTransaction(txShippedOrder, "confirmed");
      console.log("tx seller shipped the order: ", txShippedOrder);

      storeUSDC = await getAccount(provider.connection, storeUSDC.address);
      console.log("store usdc balance: ", storeUSDC.amount);

      buyerUSDC = await getAccount(provider.connection, buyerUSDC.address);
      console.log("buyer usdc balance: ", buyerUSDC.amount);

      sellerUSDC = await getAccount(provider.connection, sellerUSDC.address);
      console.log("seller usdc balance: ", sellerUSDC.amount);

      creatorUSDC = await getAccount(provider.connection, creatorUSDC.address);
      console.log("creator usdc balance: ", creatorUSDC.amount);
    } catch (error) {
      console.log(error);
    }

    const rating = 3;
    const shdw_hash_review = "8fi9nEJC5rkJYoT2eceCqECJA8nv5BzrbeDaRVX7Zsgf";
    // buyer reviews the item
    try {
      const txReviewItem = await program.methods
        .reviewItem(rating, shdw_hash_review)
        .accounts({
          user: buyer.publicKey,
          item: item,
          store: store,
          sellerAccount: sellerAccount,
          order: order,
          userUsdc: buyerUSDC.address,
          storeUsdc: storeUSDC.address,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .signers([buyer])
        .rpc();
      await provider.connection.confirmTransaction(txReviewItem, "confirmed");
      console.log("tx review item: ", txReviewItem);

      storeUSDC = await getAccount(provider.connection, storeUSDC.address);
      console.log("store usdc balance: ", storeUSDC.amount);

      buyerUSDC = await getAccount(provider.connection, buyerUSDC.address);
      console.log("buyer usdc balance: ", buyerUSDC.amount);

      sellerUSDC = await getAccount(provider.connection, sellerUSDC.address);
      console.log("seller usdc balance: ", sellerUSDC.amount);

      creatorUSDC = await getAccount(provider.connection, creatorUSDC.address);
      console.log("creator usdc balance: ", creatorUSDC.amount);
    } catch (error) {
      console.log(error);
    }

    // Delete item
    try {
      const txDeleteItem = await program.methods
        .deleteItem()
        .accounts({
          user: seller.publicKey,
          sellerAccount: sellerAccount,
          item: item,
          store: store,
        })
        .signers([seller])
        .rpc();
      await provider.connection.confirmTransaction(txDeleteItem, "confirmed");
      console.log(`tx delete item: ${txDeleteItem}`);
    } catch (error) {
      console.log(error);
    }

    // Delete seller account.
    try {
      const txDeleteSellerAccount = await program.methods
        .deleteSellerAccount()
        .accounts({
          user: seller.publicKey,
          store: store,
          sellerAccount: sellerAccount,
        })
        .signers([seller])
        .rpc();
      await provider.connection.confirmTransaction(
        txDeleteSellerAccount,
        "confirmed"
      );
      console.log(`tx delete seller account: ${txDeleteSellerAccount}`);
    } catch (error) {
      console.log(error);
    }
  });
});
