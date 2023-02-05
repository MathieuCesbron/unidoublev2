import { useState } from "react";
import SelectCategory from "./SelectCategory";
import { ImSearch } from "react-icons/im";
import "./Search.css";

const Search = () => {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  return (
    <div className="search">
      <SelectCategory />
      <input
        type="text"
        className="search-input"
        placeholder="Search for anything"
        value={input}
        onChange={handleChange}
      ></input>
      <button className="search-icon">
        <ImSearch size={"1.3em"} />
      </button>
    </div>
  );
};

export default Search;
