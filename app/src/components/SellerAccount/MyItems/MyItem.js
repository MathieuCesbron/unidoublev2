import { useEffect, useState } from "react";
import { Image } from "antd";
import USDCLogo from "../../../images/usdc-logo.png";
import "./MyItem.css";

const MyItem = ({ itemData, shadowHash }) => {
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
              border: "black solid",
              borderRadius: "5px",
              width: "250px",
              height: "250px",
            }}
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
        <h3 className="my-item-title">{itemInfo.title}</h3>
        <div className="my-item-price-stars">
          <img className="my-item-usdc-logo" src={USDCLogo} alt="usdc-logo" />
          <p className="my-item-price">{itemData.price / 100}</p>
        </div>
        <p className="my-item-available-buyer">
          {itemData.amount} available / {itemData.buyer_count} buyer
        </p>
      </div>
    </div>
  );
};

export default MyItem;
