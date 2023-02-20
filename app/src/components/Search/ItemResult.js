import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Button, Image, Rate, Modal, InputNumber } from "antd";
import USDCLogo from "../../images/usdc-logo.png";
import "../SellerAccount/Option.css";
import "./ItemResult.css";

const ItemResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [showModalBuy, setShowModalBuy] = useState(false);

  useEffect(() => {
    (async () => {
      // if state is undefined, we should get the data on chain since we have the unique_number on the url.
    })();
  });

  return (
    <div className="option-wrapper">
      <div className="option-top">
        <IoArrowBackCircleOutline
          className="option-back-arrow"
          size={"5em"}
          onClick={() => navigate(-1)}
        />
        <h4 className="option-title">{state.itemInfo.title}</h4>
      </div>
      <div className="item-result-wrapper">
        <Image
          preview={{ visible: false }}
          width={"50%"}
          style={{ border: "black solid 1px", borderRadius: "2px" }}
          src={`https://shdw-drive.genesysgo.net/${state.itemData.shdw_hash_seller}/${state.itemInfo.images[0]}`}
          onClick={() => setVisible(true)}
        />
        <div style={{ display: "none" }}>
          <Image.PreviewGroup
            preview={{ visible, onVisibleChange: (vis) => setVisible(vis) }}
          >
            {state.itemInfo.images.map((image) => (
              <Image
                key={image}
                src={`https://shdw-drive.genesysgo.net/${state.itemData.shdw_hash_seller}/${image}`}
              />
            ))}
          </Image.PreviewGroup>
        </div>
        <div className="item-result-body">
          <div className="item-result-field">
            <img className="item-usdc-logo" src={USDCLogo} alt="usdc-logo" />
            <p className="item-usdc">{state.itemData.price / 100}</p>
          </div>
          <Rate
            disabled
            allowHalf
            defaultValue={state.itemData.rating}
            style={{ fontSize: 28, margin: "0", maxWidth: "100%" }}
          />
          <div className="item-result-stats">
            <p className="item-result-amount">
              {state.itemData.amount} available
            </p>
            {state.itemData.buyer_count ? (
              <p className="item-result-buyers">
                {state.itemData.buyer_count}
                {state.itemData.buyer_count === 1 ? " person" : " persons"}{" "}
                bought this item
              </p>
            ) : (
              <p className="item-result-buyers">Nobody bought this item yet</p>
            )}
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => setShowModalBuy(true)}
          >
            Buy item
          </Button>
        </div>
      </div>
      <p className="item-result-description">{state.itemInfo.description}</p>
      <Modal
        title={`Buy ${state.itemInfo.title}`}
        centered
        open={showModalBuy}
        onCancel={() => setShowModalBuy(false)}
        okText="Validate transaction on wallet"
      >
        <p className="item-result-modal-price">
          Price: {state.itemData.price / 100} USDC
        </p>
        <div className="item-result-input-amount">
          <label className="item-result-amount-label">Amount to buy: </label>
          <InputNumber min={1} max={state.itemData.amount}></InputNumber>
        </div>
        <hr />
      </Modal>
    </div>
  );
};

export default ItemResult;
