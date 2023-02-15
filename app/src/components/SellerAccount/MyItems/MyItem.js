import { useEffect, useState } from "react";
import { Image } from "antd";
import USDCLogo from "../../../images/usdc-logo.png";
import { Rate } from "antd";
import "./MyItem.css";

const MyItem = ({ itemData, shadowHash, salesCount, salesVolume }) => {
  const [itemInfo, setItemInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  const [visible, setVisible] = useState(false);

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
          <button className="my-item-btn my-item-update-btn">UPDATE</button>
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
          <button className="my-item-btn my-item-delete-btn">DELETE</button>
        </div>
      </div>
    </div>
  );
};

export default MyItem;
