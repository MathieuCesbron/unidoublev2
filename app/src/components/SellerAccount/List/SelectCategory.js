import Select from "react-select";
import categories from "../../../utils/config/categories";
import "./SelectCategory.css";

const SelectCategory = ({ category, setCategory }) => {
  const filteredCategories = categories.slice(1);
  return (
    <Select
      className="list-select"
      options={filteredCategories}
      value={filteredCategories.find((c) => c.value === category)}
      onChange={(c) => setCategory(c.value)}
    />
  );
};

export default SelectCategory;
