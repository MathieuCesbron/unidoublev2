import bs58 from "bs58";
import {
  publicKey as publicKeyBorsh,
  struct,
  str,
  u8,
  u16,
  u32,
  f32,
} from "@project-serum/borsh";
import { connection, programID } from "../../utils/solana/program";
import { country } from "../../utils/config/store";

const getSellerAccount = async (publicKey) => {
  const sellerAccountFilters = {
    filters: [
      {
        dataSize: 204,
      },
      {
        memcmp: {
          offset: 8 + 4,
          bytes: bs58.encode(Buffer.from([country])),
        },
      },
      {
        memcmp: {
          offset: 8 + 4 + 2,
          bytes: publicKey,
        },
      },
    ],
  };

  return (
    await connection.getProgramAccounts(programID, sellerAccountFilters)
  )[0];
};

const getDecodedSellerAccount = (sellerAccount) => {
  return struct([
    u32("number"),
    u16("country"),
    publicKeyBorsh("seller_public_key"),
    publicKeyBorsh("store_public_key"),
    u32("sales_volume"),
    u32("sales_count"),
    u16("item_count"),
    str("diffie_public_key"),
    str("shdw_hash"),
  ]).decode(sellerAccount.account.data, 8);
};

const getMyItems = async (publicKey) => {
  const filters = {
    filters: [
      { dataSize: 1000 },
      {
        memcmp: {
          offset: 8 + 2 + 1 + 4 + 2,
          bytes: publicKey,
        },
      },
    ],
  };

  return await connection.getProgramAccounts(programID, filters);
};

const getItemsByCategory = async (category) => {
  const filters = {
    filters: [
      { dataSize: 1000 },
      {
        memcmp: {
          offset: 8 + 2,
          bytes: bs58.encode(Buffer.from([category.value])),
          length: 1,
        },
      },
    ],
  };

  return await connection.getProgramAccounts(programID, filters);
};

const getDecodedMyItems = (myItems) => {
  return myItems.map((myItem) => {
    return struct([
      u16("number"),
      u8("category"),
      u32("price"),
      u16("amount"),
      publicKeyBorsh("seller_public_key"),
      publicKeyBorsh("seller_account_public_key"),
      u32("buyer_count"),
      u16("rating_count"),
      f32("rating"),
    ]).decode(myItem.account.data, 8);
  });
};

export {
  getSellerAccount,
  getDecodedSellerAccount,
  getMyItems,
  getItemsByCategory,
  getDecodedMyItems,
};
