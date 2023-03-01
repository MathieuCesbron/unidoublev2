import bs58 from "bs58";
import {
  publicKey as publicKeyBorsh,
  struct,
  str,
  u8,
  u16,
  u32,
  f32,
  bool,
} from "@project-serum/borsh";
import { connection, programID } from "./program";
import { country } from "../config/store";

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

const itemStruct = struct([
  u32("unique_number"),
  u8("category"),
  u32("price"),
  u16("amount"),
  publicKeyBorsh("seller_public_key"),
  publicKeyBorsh("seller_account_public_key"),
  u32("buyer_count"),
  u16("rating_count"),
  f32("rating"),
  f32("score"),
  str("shdw_hash_seller"),
]);

const getDecodedItem = (item) => {
  const decoded = itemStruct.decode(item.data, 8);

  // Convert public keys to string for simplicity.
  return {
    ...decoded,
    seller_public_key: decoded.seller_public_key.toString(),
    seller_account_public_key: decoded.seller_account_public_key.toString(),
  };
};

const getDecodedItems = (items) => {
  return items.map((item) => {
    const decoded = {
      pubkey: item.pubkey.toString(),
      ...itemStruct.decode(item.account.data, 8),
    };

    // Convert public keys to string for simplicity.
    return {
      ...decoded,
      seller_public_key: decoded.seller_public_key.toString(),
      seller_account_public_key: decoded.seller_account_public_key.toString(),
    };
  });
};

const getOrdersForSeller = async (publicKey) => {
  const filters = {
    filters: [
      { dataSize: 800 },
      {
        memcmp: {
          offset: 8 + 4 + 4 + 32,
          bytes: publicKey,
          length: 32,
        },
      },
      // {
      //   memcmp: {
      //     offset: 8 + 4 + 4 + 32 + 32 + 32 + 32 + 4 + 2 + 1 + 1,
      //     bytes: bs58.encode(Buffer.from("false")),
      //   },
      // },
    ],
  };

  return await connection.getProgramAccounts(programID, filters);
};

const getOrdersForBuyer = async (publicKey) => {
  const filters = {
    filters: [
      { dataSize: 800 },
      {
        memcmp: {
          offset: 8 + 4 + 4,
          bytes: publicKey,
          length: 32,
        },
      },
    ],
  };

  return await connection.getProgramAccounts(programID, filters);
};

const getReviewedOrdersForItem = async (itemNumber) => {
  const filters = {
    filters: [
      { dataSize: 800 },
      {
        memcmp: {
          offset: 8 + 4,
          bytes: bs58.encode(Buffer.from([itemNumber])),
          length: 4,
        },
      },
      {
        memcmp: {
          offset: 8 + 4 + 4 + 32 + 32 + 32 + 32 + 4 + 2 + 1 + 1,
          bytes: bs58.encode(Buffer.from([true])),
        },
      },
    ],
  };

  return await connection.getProgramAccounts(programID, filters);
};

const getDecodedOrders = (orders) => {
  return orders.map((order) => {
    const decoded = {
      pubkey: order.pubkey.toString(),
      ...struct([
        u32("order_number"),
        u32("item_number"),
        publicKeyBorsh("buyer_public_key"),
        publicKeyBorsh("seller_public_key"),
        publicKeyBorsh("seller_account_public_key"),
        publicKeyBorsh("item_account_public_key"),
        u32("price_bought"),
        u16("amount_bought"),
        bool("is_approved"),
        bool("is_shipped"),
        bool("is_reviewed"),
        str("shdw_hash_seller"),
        str("shdw_hash_buyer"),
      ]).decode(order.account.data, 8),
    };

    // Convert public keys to string for simplicity.
    return {
      ...decoded,
      buyer_public_key: decoded.buyer_public_key.toString(),
      seller_public_key: decoded.seller_public_key.toString(),
      seller_account_public_key: decoded.seller_account_public_key.toString(),
      item_account_public_key: decoded.item_account_public_key.toString(),
    };
  });
};

export {
  getBuyerAccount,
  getSellerAccount,
  getDecodedBuyerAccount,
  getDecodedSellerAccount,
  getMyItems,
  getDecodedItem,
  getDecodedItems,
  getItemsByCategory,
  getOrdersForSeller,
  getOrdersForBuyer,
  getReviewedOrdersForItem,
  getDecodedOrders,
};
//
