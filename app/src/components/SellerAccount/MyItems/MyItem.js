import { useEffect, useState } from "react";
import { Image } from "antd";
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
            width={200}
            height={200}
            style={{
              objectFit: "cover",
              border: "black solid",
              borderRadius: "5px",
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
          {/* <h4>{itemInfo.title}</h4>
          <p>{itemInfo.description}</p> */}
        </>
      )}
    </div>
  );
};

export default MyItem;
