import { useEffect, useState } from "react";

const MyItem = ({ itemData, shadowHash }) => {
  const [itemInfo, setItemInfo] = useState([]);
  const [loading, setLoading] = useState(true);

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
          <h4>{itemInfo.title}</h4>
          <p>{itemInfo.description}</p>
          <>
            {itemInfo.extensions.map((extension, index) => (
              <img
                src={`https://shdw-drive.genesysgo.net/${shadowHash}/item${
                  itemData.number
                }_image${index + 1}.${extension}`}
                key={index}
              />
            ))}
          </>
        </>
      )}
    </div>
  );
};

export default MyItem;
