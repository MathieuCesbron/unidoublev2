import Select from "react-select";
import categories from "../../utils/config/categories";
import useStore from "../../store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SelectCategory.css";

const SelectCategory = () => {
  const navigate = useNavigate();

  const category = useStore((state) => state.category);
  const setCategory = useStore((state) => state.setCategory);

  useEffect(() => {
    if (category.value !== -1) navigate("/search");
  }, [category]);

  return (
    <Select
      className="select"
      styles={{
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderTopLeftRadius: "4px",
          borderBottomLeftRadius: "4px",
          borderRadius: 0,
        }),
      }}
      options={categories}
      defaultValue={{ value: -1, label: "All" }}
      value={categories.find((c) => c.value === category)}
      onChange={setCategory}
    />
  );
};

export default SelectCategory;
