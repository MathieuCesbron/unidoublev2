import { useEffect, useState } from "react";
import { Image } from "antd";
import USDCLogo from "../../../images/usdc-logo.png";
import { Rate, Modal, Checkbox } from "antd";
import "./MyItem.css";
import { program, storePubKey } from "../../../utils/solana/program";
import { useWallet } from "@solana/wallet-adapter-react";

const MyItem = ({
  itemData,
  shadowHash,
  salesCount,
  salesVolume,
  sellerAccountPublicKey,
}) => {
  const { publicKey } = useWallet();
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

  const handleDeleteItem = async () => {
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
  };

  useEffect(() => {
    (async () => {
      fetch(
        `https://shdw-drive.genesysgo.net/${shadowHash}/item${itemData.number}.json`,
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

  const myItemUpdateHandler = () => {
    console.log("update");
  };

  const myItemDeleteHandler = () => {
    setIsModalDeleteOpen(true);
  };

  return (
    <div className="my-item-wrapper">
      {!loading && (
        <>
          <Image
            preview={{ visible: false }}
            style={{
              objectFit: "cover",
              width: "250px",
              height: "250px",
            }}
            className="my-item-image"
            src={`https://shdw-drive.genesysgo.net/${shadowHash}/item${itemData.number}_image1.${itemInfo.extensions[0]}`}
            onClick={() => setVisible(true)}
          />
          <div style={{ display: "none" }}>
            <Image.PreviewGroup
              preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
            >
              {itemInfo.extensions.map((extension, index) => (
                <Image
                  src={`https://shdw-drive.genesysgo.net/${shadowHash}/item${
                    itemData.number
                  }_image${index + 1}.${extension}`}
                />
              ))}
            </Image.PreviewGroup>
          </div>
        </>
      )}
      <div className="my-item-body">
        <div className="my-item-top">
          <h3 className="my-item-title">{itemInfo.title}</h3>
          <button
            className="my-item-btn my-item-update-btn"
            onClick={myItemUpdateHandler}
          >
            UPDATE
          </button>
        </div>
        <div className="my-item-mid">
          <div className="my-item-price">
            <img className="my-item-usdc-logo" src={USDCLogo} alt="usdc-logo" />
            <p className="my-item-usdc">{itemData.price / 100}</p>
          </div>
          <Rate
            disabled
            allowHalf
            defaultValue={itemData.rating}
            style={{ fontSize: 28 }}
            className="my-item-rate"
          />
        </div>
        <div className="my-item-bottom">
          <div>
            <p className="my-item-stats">
              {itemData.amount} available / {itemData.buyer_count} buyer
            </p>
            <p className="my-item-score">
              SCORE:&nbsp;
              {itemData.rating *
                itemData.rating_count *
                itemData.buyer_count *
                salesCount *
                salesVolume}
            </p>
          </div>
          <button
            className="my-item-btn my-item-delete-btn"
            onClick={myItemDeleteHandler}
          >
            DELETE
          </button>
        </div>
      </div>
      <Modal
        title={`Delete item: ${itemInfo.title}`}
        open={isModalDeleteOpen}
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

export default MyItem;
