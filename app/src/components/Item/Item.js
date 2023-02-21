import { useEffect, useState } from "react";
import { Image } from "antd";
import USDCLogo from "../../images/usdc-logo.png";
import { Rate, Modal, Checkbox } from "antd";
import {
  privateConnection,
  program,
  storePubKey,
} from "../../utils/solana/program";
import { useWallet } from "@solana/wallet-adapter-react";
import categories from "../../utils/config/categories";
import { ShdwDrive } from "@shadow-drive/sdk";
import { PublicKey } from "@solana/web3.js";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Button, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import "./Item.css";

const Item = ({
  itemData,
  mode,
  salesCount,
  salesVolume,
  setDecodedItems,
  sellerAccountPublicKey,
}) => {
  const wallet = useWallet();
  const { publicKey } = useWallet();
  const navigate = useNavigate();

  const [itemInfo, setItemInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isDeleteItemSure, setIsDeleteItemSure] = useState(false);

  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false);
  };

  const checkboxHandler = (e) => {
    setIsDeleteItemSure(e.target.checked);
  };

  useEffect(() => {
    (async () => {
      fetch(
        `https://shdw-drive.genesysgo.net/${itemData.shdw_hash_seller}/${itemData.unique_number}.json`,
      )
        .then((res) => res.json())
        .then((resData) => {
          setItemInfo(resData);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    })();
  }, []);

  const handleDeleteItem = async () => {
    const drive = await new ShdwDrive(privateConnection, wallet).init();

    // delete files on shadow drive only if we are on mainnet.
    // TODO: check that it works on mainnet, I succeeded to delete a file, it should works.
    if (WalletAdapterNetwork === WalletAdapterNetwork.Mainnet) {
      const filesToDelete = [`item${itemData.number}.json`];

      itemInfo.extensions.forEach((extension, index) => {
        filesToDelete.push(
          `item${itemData.number}_image${index + 1}.${extension}`,
        );
      });

      filesToDelete.forEach(async (fileToDelete) => {
        console.log(
          `https://shdw-drive.genesysgo.net/${itemData.shdw_hash_seller}/${fileToDelete}`,
        );
        const deleteRes = await drive.deleteFile(
          new PublicKey(itemData.shdw_hash_seller),
          `https://shdw-drive.genesysgo.net/${itemData.shdw_hash_seller}/${fileToDelete}`,
          "v2",
        );
        console.log(deleteRes);
      });
    }

    const txDeleteItem = await program.methods
      .deleteItem()
      .accounts({
        user: publicKey,
        sellerAccount: sellerAccountPublicKey,
        item: itemData.pubkey,
        store: storePubKey,
      })
      .rpc();
    console.log(txDeleteItem);
    setDecodedItems((prevDecodedItems) =>
      prevDecodedItems.filter(
        (prevDecodedItem) => prevDecodedItem.pubkey !== itemData.pubkey,
      ),
    );
    setIsModalDeleteOpen(false);
  };

  const ItemUpdateHandler = () => {
    console.log("update");
  };

  const ItemDeleteHandler = () => {
    setIsModalDeleteOpen(true);
  };

  const itemCheckoutHandler = () => {
    // We have to give the seller_public_key separately.
    navigate(`/item/${itemData.unique_number}`, {
      state: {
        itemInfo: itemInfo,
        itemData: itemData,
        seller_public_key: itemData.seller_public_key.toString(),
      },
    });
  };

  return (
    <div className="item-wrapper">
      {!loading && (
        <>
          <Image
            preview={{ visible: false }}
            style={{
              objectFit: "cover",
              width: "250px",
              height: "250px",
            }}
            className="item-image"
            src={`https://shdw-drive.genesysgo.net/${itemData.shdw_hash_seller}/${itemInfo.images[0]}`}
            onClick={() => setVisible(true)}
          />
          <div style={{ display: "none" }}>
            <Image.PreviewGroup
              preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
            >
              {itemInfo.images.map((image) => (
                <Image
                  key={image}
                  src={`https://shdw-drive.genesysgo.net/${itemData.shdw_hash_seller}/${image}`}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        </>
      )}
      <div className="item-body">
        <div className="item-top">
          <div>
            <h3 className="item-title">{itemInfo.title}</h3>
            <p className="item-category">
              {categories.find((c) => c.value === itemData.category).label}
            </p>
          </div>
          {mode === "search" ? (
            <Tag color="blue" style={{ margin: "0" }}>
              {/* TODO: put actual ranking here */}
              #1
            </Tag>
          ) : (
            <Button type="primary" onClick={ItemUpdateHandler} size="large">
              UPDATE
            </Button>
          )}
        </div>{" "}
        <div className="item-mid">
          <div className="item-price">
            <img className="item-usdc-logo" src={USDCLogo} alt="usdc-logo" />
            <p className="item-usdc">{itemData.price / 100}</p>
          </div>
          <Rate
            disabled
            allowHalf
            defaultValue={itemData.rating}
            style={{ fontSize: 28 }}
            className="item-rate"
          />
        </div>
        <div className="item-bottom">
          <div>
            <p className="item-stats">
              {itemData.amount} available / {itemData.buyer_count} buyer
            </p>
            <p className="item-score">
              SCORE:&nbsp;
              {itemData.rating *
                itemData.rating_count *
                itemData.buyer_count *
                salesCount *
                salesVolume}
            </p>
          </div>
          {mode === "search" ? (
            <Button
              type="primary"
              size="large"
              style={{ alignSelf: "flex-end" }}
              onClick={itemCheckoutHandler}
            >
              CHECKOUT
            </Button>
          ) : (
            <Button
              type="primary"
              danger
              size="large"
              style={{ alignSelf: "flex-end" }}
              onClick={ItemDeleteHandler}
            >
              DELETE
            </Button>
          )}
        </div>
      </div>
      <Modal
        title={`Delete item: ${itemInfo.title}`}
        open={isModalDeleteOpen}
        centered
        onCancel={handleDeleteCancel}
        onOk={handleDeleteItem}
        okButtonProps={{
          danger: true,
          disabled: !isDeleteItemSure,
        }}
        okText="DELETE"
      >
        <p>You will get 0.00785 SOL back.</p>
        <Checkbox onChange={checkboxHandler}>
          I want to delete this article
        </Checkbox>
      </Modal>
    </div>
  );
};

export default Item;
