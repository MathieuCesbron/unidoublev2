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

const getBuyerAccount = async (publicKey) => {
  const buyerAccountFilters = {
    filters: [
      {
        dataSize: 88,
      },
      {
        memcmp: {
          offset: 8,
          bytes: publicKey,
        },
      },
    ],
  };

  return (
    await connection.getProgramAccounts(programID, buyerAccountFilters)
  )[0];
};

const getDecodedBuyerAccount = (buyerAccount) => {
  return struct([publicKeyBorsh("buyer_public_key"), str("shdw_hash")]).decode(
    buyerAccount.account.data,
    8,
  );
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
          offset: 8 + 4 + 1 + 4 + 2,
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
          offset: 8 + 4,
          bytes: bs58.encode(Buffer.from([category.value])),
          length: 1,
        },
      },
    ],
  };

  return await connection.getProgramAccounts(programID, filters);
};

const getDecodedItems = (items) => {
  return items.map((item) => {
    return {
      pubkey: item.pubkey.toString(),
      ...struct([
        u32("unique_number"),
        u8("category"),
        u32("price"),
        u16("amount"),
        publicKeyBorsh("seller_public_key"),
        publicKeyBorsh("seller_account_public_key"),
        u32("buyer_count"),
        u16("rating_count"),
        f32("rating"),
        str("shdw_hash_seller"),
      ]).decode(item.account.data, 8),
    };
  });
};

export {
  getBuyerAccount,
  getSellerAccount,
  getDecodedBuyerAccount,
  getDecodedSellerAccount,
  getMyItems,
  getDecodedItems,
  getItemsByCategory,
};
