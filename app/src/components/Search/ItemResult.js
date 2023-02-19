import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { Button, Image, Input } from "antd";
import "../SellerAccount/Option.css";
import "./ItemResult.css";

const ItemResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    (async () => {
      // if state is undefined, we should get the data on chain since we have the unique_number on the url.
    })();
  });

  console.log(state);

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
        <form className="item-result-form">
          <div className="item-result-field">
            <label className="item-result-field-label">Quantity:</label>
            <Input placeholder="1"></Input>
          </div>
          <div className="item-result-field">
            <label className="item-result-field-label">Price:</label>
            <p>{state.itemData.price / 100}</p>
          </div>
          <Button type="primary" size="large">
            Buy item
          </Button>
        </form>
      </div>
      <p className="item-result-description">{state.itemInfo.description}</p>
    </div>
  );
};

export default ItemResult;
