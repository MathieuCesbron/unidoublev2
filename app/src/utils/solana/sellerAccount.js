import bs58 from "bs58";
import {
  publicKey as publicKeyBorsh,
  struct,
  str,
  u32,
  u16,
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

export { getSellerAccount, getDecodedSellerAccount };
